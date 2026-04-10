--
-- PostgreSQL database dump
--

\restrict iYfow2ha5mlSLpgNeEnoVpBrwU6jeSTOyHBoCBaOoijYrIKXo2pzvitwaXPQrdG

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: favourite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favourite (
    id integer NOT NULL,
    id_owner integer NOT NULL,
    type_object character varying(255) NOT NULL,
    id_object integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.favourite OWNER TO postgres;

--
-- Name: favourite_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favourite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favourite_id_seq OWNER TO postgres;

--
-- Name: favourite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favourite_id_seq OWNED BY public.favourite.id;


--
-- Name: liked; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.liked (
    id integer NOT NULL,
    id_owner integer NOT NULL,
    type_object character varying(255) NOT NULL,
    id_object integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.liked OWNER TO postgres;

--
-- Name: liked_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.liked_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.liked_id_seq OWNER TO postgres;

--
-- Name: liked_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.liked_id_seq OWNED BY public.liked.id;


--
-- Name: point; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.point (
    id integer NOT NULL,
    id_owner integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    is_free boolean NOT NULL,
    is_custom boolean NOT NULL,
    rating numeric(3,1) DEFAULT 0,
    coordinates public.geometry(Point) NOT NULL,
    photos json,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.point OWNER TO postgres;

--
-- Name: point_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.point_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.point_id_seq OWNER TO postgres;

--
-- Name: point_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.point_id_seq OWNED BY public.point.id;


--
-- Name: review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review (
    id integer NOT NULL,
    id_owner integer NOT NULL,
    type_object character varying(255) NOT NULL,
    id_object integer NOT NULL,
    rating numeric(3,1),
    comment character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.review OWNER TO postgres;

--
-- Name: review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.review_id_seq OWNER TO postgres;

--
-- Name: review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_id_seq OWNED BY public.review.id;


--
-- Name: route; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.route (
    id integer NOT NULL,
    id_owner integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    is_public boolean DEFAULT true NOT NULL,
    count_likes integer DEFAULT 0 NOT NULL,
    count_dislikes integer DEFAULT 0 NOT NULL,
    "time" time without time zone DEFAULT '00:00:00'::time without time zone NOT NULL,
    length numeric DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.route OWNER TO postgres;

--
-- Name: route-point; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."route-point" (
    id integer NOT NULL,
    id_point integer NOT NULL,
    id_route integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."route-point" OWNER TO postgres;

--
-- Name: route-point_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."route-point_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."route-point_id_seq" OWNER TO postgres;

--
-- Name: route-point_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."route-point_id_seq" OWNED BY public."route-point".id;


--
-- Name: route_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.route_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.route_id_seq OWNER TO postgres;

--
-- Name: route_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.route_id_seq OWNED BY public.route.id;


--
-- Name: tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.tag OWNER TO postgres;

--
-- Name: tag-point; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."tag-point" (
    id integer NOT NULL,
    id_tag integer NOT NULL,
    id_point integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."tag-point" OWNER TO postgres;

--
-- Name: tag-point_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."tag-point_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."tag-point_id_seq" OWNER TO postgres;

--
-- Name: tag-point_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."tag-point_id_seq" OWNED BY public."tag-point".id;


--
-- Name: tag-route; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."tag-route" (
    id integer NOT NULL,
    id_tag integer NOT NULL,
    id_route integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."tag-route" OWNER TO postgres;

--
-- Name: tag-route_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."tag-route_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."tag-route_id_seq" OWNER TO postgres;

--
-- Name: tag-route_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."tag-route_id_seq" OWNED BY public."tag-route".id;


--
-- Name: tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tag_id_seq OWNER TO postgres;

--
-- Name: tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tag_id_seq OWNED BY public.tag.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(255) DEFAULT 'user'::character varying NOT NULL,
    photo character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: favourite id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favourite ALTER COLUMN id SET DEFAULT nextval('public.favourite_id_seq'::regclass);


--
-- Name: liked id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liked ALTER COLUMN id SET DEFAULT nextval('public.liked_id_seq'::regclass);


--
-- Name: point id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.point ALTER COLUMN id SET DEFAULT nextval('public.point_id_seq'::regclass);


--
-- Name: review id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review ALTER COLUMN id SET DEFAULT nextval('public.review_id_seq'::regclass);


--
-- Name: route id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.route ALTER COLUMN id SET DEFAULT nextval('public.route_id_seq'::regclass);


--
-- Name: route-point id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."route-point" ALTER COLUMN id SET DEFAULT nextval('public."route-point_id_seq"'::regclass);


--
-- Name: tag id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag ALTER COLUMN id SET DEFAULT nextval('public.tag_id_seq'::regclass);


--
-- Name: tag-point id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tag-point" ALTER COLUMN id SET DEFAULT nextval('public."tag-point_id_seq"'::regclass);


--
-- Name: tag-route id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tag-route" ALTER COLUMN id SET DEFAULT nextval('public."tag-route_id_seq"'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: favourite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favourite (id, id_owner, type_object, id_object, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: liked; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.liked (id, id_owner, type_object, id_object, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: point; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.point (id, id_owner, name, description, is_free, is_custom, rating, coordinates, photos, "createdAt", "updatedAt") FROM stdin;
4	1	Сердце Ростова	Маршрут, где встречаются неожиданные радости: от обаятельных альпак и итальянской пиццы к высокому искусству в легендарном театре...	t	t	0.0	0101000020E6100000884B8E3BA57743408B37328FFC994740	\N	2026-02-19 16:07:49.289+03	2026-02-19 16:07:49.289+03
5	1	Конюшня	Маршрут, где встречаются неожиданные радости: от обаятельных альпак и итальянской пиццы к высокому искусству в легендарном театре...	t	t	0.0	0101000020E6100000FF959526A5DC43403541D47D009E4740	\N	2026-02-20 13:21:46.272+03	2026-02-20 13:21:46.272+03
6	1	Институт Компьютерных Технологий и Информационной Безопасности Южный Федеральный Университет, Корпус Г	Основной корпус, в котором проходит большинство занятий студентов ИКТИБ ЮФУ	t	t	0.0	0101000020E6100000CF143AAFB177434020D26F5F079A4740	\N	2026-03-11 23:33:07.618+03	2026-03-11 23:33:07.618+03
7	1	Трамвайная остановка 'Университет'	Проходят трамваи под номером 2, 3, 5, 8	t	t	0.0	0101000020E610000079AF5A99F0774340912749D74C9A4740	\N	2026-03-11 23:34:59.843+03	2026-03-11 23:34:59.843+03
8	1	SubJoy	Вкусная, а главное полезная еда в виде огромного ассортимента сендвичей	t	t	0.0	0101000020E61000008BA6B393C175434032207BBDFB9B4740	\N	2026-03-11 23:36:40.259+03	2026-03-11 23:36:40.259+03
9	1	Общежитие №1 'Копейка'	Вмещает в себя порядка 350 студентов, удобно расположена вблизи к основным корпусам	t	t	0.0	0101000020E61000005DFE43FAED774340FB912232AC9A4740	\N	2026-03-12 10:23:47.976+03	2026-03-12 10:23:47.976+03
10	1	Автобусная остановка '5-й микрорайон'	Проходят автобусы под номером 30, 31, 15, 29	t	t	0.0	0101000020E610000059FAD005F56D43404ED1915CFE9B4740	\N	2026-03-12 10:25:31.44+03	2026-03-12 10:25:31.44+03
11	1	Магазин Пятерочка	У дома	t	t	0.0	0101000020E6100000C4995FCD016E43405C8FC2F5289C4740	["https://imgv3.fotor.com/images/blog-cover-image/a-shadow-of-a-boy-carrying-the-camera-with-red-sky-behind.jpg","https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg","https://iso.500px.com/wp-content/uploads/2019/07/stock-photo-maderas-312058103.jpg"]	2026-03-14 16:20:26.326+03	2026-03-14 16:20:26.326+03
\.


--
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review (id, id_owner, type_object, id_object, rating, comment, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: route; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.route (id, id_owner, name, description, is_public, count_likes, count_dislikes, "time", length, "createdAt", "updatedAt") FROM stdin;
1	1	Университет -> Остановка Университет -> SubJoy	Удобный и аппетитный маршрут после учебы	t	0	0	00:15:00	1200	2026-03-11 23:39:04.131+03	2026-03-11 23:39:04.131+03
2	1	Русское поле -> Общежитие №1	Как добраться до дома с русского поля	t	0	0	00:30:00	1200	2026-03-12 10:26:48.718+03	2026-03-12 10:26:48.718+03
\.


--
-- Data for Name: route-point; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."route-point" (id, id_point, id_route, "createdAt", "updatedAt") FROM stdin;
1	6	1	2026-03-11 23:39:04.288+03	2026-03-11 23:39:04.288+03
2	7	1	2026-03-11 23:39:04.288+03	2026-03-11 23:39:04.288+03
3	8	1	2026-03-11 23:39:04.288+03	2026-03-11 23:39:04.288+03
4	10	2	2026-03-12 10:26:48.853+03	2026-03-12 10:26:48.853+03
5	9	2	2026-03-12 10:26:48.853+03	2026-03-12 10:26:48.853+03
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag (id, name, "createdAt", "updatedAt") FROM stdin;
1	Красиво	2026-03-12 17:37:33.935+03	2026-03-12 17:37:33.935+03
2	Пешком	2026-03-12 17:37:33.935+03	2026-03-12 17:37:33.935+03
3	На велосипеде	2026-03-12 17:37:33.935+03	2026-03-12 17:37:33.935+03
4	На автомобиле	2026-03-12 17:37:33.935+03	2026-03-12 17:37:33.935+03
5	Дешево	2026-03-12 17:37:33.935+03	2026-03-12 17:37:33.935+03
6	Бесплатно	2026-03-12 17:37:33.935+03	2026-03-12 17:37:33.935+03
7	Дорого	2026-03-12 17:37:33.935+03	2026-03-12 17:37:33.935+03
8	Гастро тур	2026-03-12 17:37:33.935+03	2026-03-12 17:37:33.935+03
9	Прогулка	2026-03-12 17:37:33.935+03	2026-03-12 17:37:33.935+03
10	Культура	2026-03-12 17:37:33.935+03	2026-03-12 17:37:33.935+03
11	С детьми	2026-03-12 17:37:33.935+03	2026-03-12 17:37:33.935+03
\.


--
-- Data for Name: tag-point; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."tag-point" (id, id_tag, id_point, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: tag-route; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."tag-route" (id, id_tag, id_route, "createdAt", "updatedAt") FROM stdin;
1	2	1	2026-03-11 23:39:04.131+03	2026-03-11 23:39:04.131+03
2	3	1	2026-03-11 23:39:04.131+03	2026-03-11 23:39:04.131+03
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, username, email, password, role, photo, "createdAt", "updatedAt") FROM stdin;
1	Sam	Sam@mail.com	$2b$05$dhMrNd9jQtBghe1UeHDI1O2Hk9du9HUIJELClvv9tQKwqgW7QLPfi	user	\N	2026-02-19 11:44:19.186+03	2026-02-19 11:44:19.186+03
\.


--
-- Name: favourite_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favourite_id_seq', 1, false);


--
-- Name: liked_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.liked_id_seq', 1, false);


--
-- Name: point_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.point_id_seq', 11, true);


--
-- Name: review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_id_seq', 1, false);


--
-- Name: route-point_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."route-point_id_seq"', 5, true);


--
-- Name: route_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.route_id_seq', 2, true);


--
-- Name: tag-point_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."tag-point_id_seq"', 1, false);


--
-- Name: tag-route_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."tag-route_id_seq"', 1, false);


--
-- Name: tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tag_id_seq', 11, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 1, true);


--
-- Name: favourite favourite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favourite
    ADD CONSTRAINT favourite_pkey PRIMARY KEY (id);


--
-- Name: liked liked_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liked
    ADD CONSTRAINT liked_pkey PRIMARY KEY (id);


--
-- Name: point point_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.point
    ADD CONSTRAINT point_pkey PRIMARY KEY (id);


--
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (id);


--
-- Name: route-point route-point_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."route-point"
    ADD CONSTRAINT "route-point_pkey" PRIMARY KEY (id);


--
-- Name: route route_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.route
    ADD CONSTRAINT route_pkey PRIMARY KEY (id);


--
-- Name: tag-point tag-point_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tag-point"
    ADD CONSTRAINT "tag-point_pkey" PRIMARY KEY (id);


--
-- Name: tag-route tag-route_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tag-route"
    ADD CONSTRAINT "tag-route_pkey" PRIMARY KEY (id);


--
-- Name: tag tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: favourite favourite_id_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favourite
    ADD CONSTRAINT favourite_id_owner_fkey FOREIGN KEY (id_owner) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: liked liked_id_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liked
    ADD CONSTRAINT liked_id_owner_fkey FOREIGN KEY (id_owner) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: point point_id_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.point
    ADD CONSTRAINT point_id_owner_fkey FOREIGN KEY (id_owner) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review review_id_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_id_owner_fkey FOREIGN KEY (id_owner) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: route-point route-point_id_point_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."route-point"
    ADD CONSTRAINT "route-point_id_point_fkey" FOREIGN KEY (id_point) REFERENCES public.point(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: route-point route-point_id_route_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."route-point"
    ADD CONSTRAINT "route-point_id_route_fkey" FOREIGN KEY (id_route) REFERENCES public.route(id) ON UPDATE CASCADE;


--
-- Name: route route_id_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.route
    ADD CONSTRAINT route_id_owner_fkey FOREIGN KEY (id_owner) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tag-point tag-point_id_point_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tag-point"
    ADD CONSTRAINT "tag-point_id_point_fkey" FOREIGN KEY (id_point) REFERENCES public.point(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tag-point tag-point_id_tag_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tag-point"
    ADD CONSTRAINT "tag-point_id_tag_fkey" FOREIGN KEY (id_tag) REFERENCES public.tag(id) ON UPDATE CASCADE;


--
-- Name: tag-route tag-route_id_route_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tag-route"
    ADD CONSTRAINT "tag-route_id_route_fkey" FOREIGN KEY (id_route) REFERENCES public.route(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tag-route tag-route_id_tag_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tag-route"
    ADD CONSTRAINT "tag-route_id_tag_fkey" FOREIGN KEY (id_tag) REFERENCES public.tag(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict iYfow2ha5mlSLpgNeEnoVpBrwU6jeSTOyHBoCBaOoijYrIKXo2pzvitwaXPQrdG

