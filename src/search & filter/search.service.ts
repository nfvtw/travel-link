import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { Point } from 'src/point/point.model';

@Injectable()
export class SearchService {

    constructor(@InjectModel(Point) private pointRepository: typeof Point) {}

    async search(query: string) {
        const result = await this.pointRepository.sequelize?.query(`
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
        );
        return {
            result: result, 
            length: result?.length
        };
    }

}
