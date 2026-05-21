import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { Point } from 'src/point/point.model';
import { Review } from 'src/review/review.model';

@Injectable()
export class SearchService {

    constructor(@InjectModel(Point) private pointRepository: typeof Point,
                @InjectModel(Review) private reviewRepository: typeof Review) {}

    async search(query: string) {
        const rawPoints = await this.pointRepository.sequelize?.query(`
                SELECT p.*, (d.score_d * 40 + n.score_n * 60) as score
                FROM point p
                LEFT JOIN LATERAL (
                    SELECT SUM(word_similarity(word, :query)) AS score_d
                    FROM unnest(string_to_array(p.description, ' ')) AS t(word)
                ) d ON true
                LEFT JOIN LATERAL (
                    SELECT SUM(word_similarity(word, :query)) AS score_n
                    FROM unnest(string_to_array(p.name, ' ')) AS t(word)
                ) n ON true
                WHERE (d.score_d * 40 + n.score_n * 60) > 30
                ORDER BY (d.score_d * 30 + n.score_n * 70) DESC
                LIMIT 10;`, 
                {
                    replacements: { query },
                    type: QueryTypes.SELECT
                } 
        ) as any [] || []

        console.log(rawPoints)

        if (!rawPoints) {
            return []
        }

        const points = rawPoints.map(item => Point.build(item, { isNewRecord: false }));

        return await Promise.all(points.map(async (p) => {
            // 1. Получаем данные из модели. 
            // Вместо сложного as, используем any, чтобы TypeScript не ругался на несовпадение
            const data = p.get({ plain: true }) as any; 

            // 2. Делаем запрос count
            const ratingCount = await this.reviewRepository.count({
                where: {
                    type_object: 'point', 
                    id_object: data.id
                }
            });

            // 3. Явно маппим поля. 
            // Здесь data.id, data.pointName и т.д. — это доступ к свойствам объекта.
            return {
                id: data.id,
                pointName: data.name,        // Убедитесь, что в базе колонка называется именно так
                pointType: data.type,
                pointLocation: data.address,
                pointDescription: data.description,
                image: data.first_photo,          // Соответствие колонок
                pointRating: Number(data.rating),
                ratingCount: ratingCount,
                imageCarousel: data.photos
            };
        }));

    }

}
