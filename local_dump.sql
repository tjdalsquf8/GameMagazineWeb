--
-- PostgreSQL database dump
--

\restrict wfdXZY80hgMbebKGcJP948sxiZBdsTZHoVxdJ3FVDpi9O0nx93ftUms4rdhy8XL

-- Dumped from database version 16.13 (Postgres.app)
-- Dumped by pg_dump version 18.4

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: NewsStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NewsStatus" AS ENUM (
    'PUBLISHED',
    'HIDDEN'
);


ALTER TYPE public."NewsStatus" OWNER TO postgres;

--
-- Name: Provider; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Provider" AS ENUM (
    'EMAIL',
    'GOOGLE'
);


ALTER TYPE public."Provider" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: ban_histories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ban_histories (
    id integer NOT NULL,
    user_id text NOT NULL,
    duration text NOT NULL,
    reason text NOT NULL,
    banned_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    banned_until timestamp(3) without time zone,
    admin_id text
);


ALTER TABLE public.ban_histories OWNER TO postgres;

--
-- Name: ban_histories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ban_histories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ban_histories_id_seq OWNER TO postgres;

--
-- Name: ban_histories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ban_histories_id_seq OWNED BY public.ban_histories.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    parent_id integer
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: comment_recommends; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment_recommends (
    id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id text NOT NULL,
    comment_id integer NOT NULL
);


ALTER TABLE public.comment_recommends OWNER TO postgres;

--
-- Name: comment_recommends_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comment_recommends_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comment_recommends_id_seq OWNER TO postgres;

--
-- Name: comment_recommends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comment_recommends_id_seq OWNED BY public.comment_recommends.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    content text NOT NULL,
    post_id integer NOT NULL,
    author_id text,
    parent_id integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    is_hidden boolean DEFAULT false NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: editor_pick_articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.editor_pick_articles (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    main_category text NOT NULL,
    thumbnail_url text NOT NULL,
    author_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    is_hidden boolean DEFAULT false NOT NULL
);


ALTER TABLE public.editor_pick_articles OWNER TO postgres;

--
-- Name: email_verifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_verifications (
    id integer NOT NULL,
    email text NOT NULL,
    code text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fail_count integer DEFAULT 0 NOT NULL,
    locked_until timestamp(3) without time zone
);


ALTER TABLE public.email_verifications OWNER TO postgres;

--
-- Name: email_verifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.email_verifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.email_verifications_id_seq OWNER TO postgres;

--
-- Name: email_verifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.email_verifications_id_seq OWNED BY public.email_verifications.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news (
    id text NOT NULL,
    original_title text NOT NULL,
    original_link text NOT NULL,
    original_pub_date timestamp(3) without time zone,
    source_name text NOT NULL,
    main_category text NOT NULL,
    sub_category text NOT NULL,
    classify_method text NOT NULL,
    rewritten_title text NOT NULL,
    rewritten_summary text NOT NULL,
    rewritten_body text NOT NULL,
    tags text[],
    status public."NewsStatus" DEFAULT 'PUBLISHED'::public."NewsStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    view_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.news OWNER TO postgres;

--
-- Name: news_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news_categories (
    id text NOT NULL,
    main_category text NOT NULL,
    name text NOT NULL,
    keywords text[],
    excludes text[],
    is_active boolean DEFAULT true NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.news_categories OWNER TO postgres;

--
-- Name: news_recommends; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news_recommends (
    id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id text NOT NULL,
    news_id text NOT NULL
);


ALTER TABLE public.news_recommends OWNER TO postgres;

--
-- Name: news_recommends_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.news_recommends_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_recommends_id_seq OWNER TO postgres;

--
-- Name: news_recommends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.news_recommends_id_seq OWNED BY public.news_recommends.id;


--
-- Name: news_sources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news_sources (
    id text NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    language text NOT NULL,
    platform text,
    is_active boolean DEFAULT true NOT NULL,
    last_fetch_at timestamp(3) without time zone,
    last_count integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.news_sources OWNER TO postgres;

--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    id integer NOT NULL,
    email text NOT NULL,
    code text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_tokens_id_seq OWNER TO postgres;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- Name: pipeline_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pipeline_logs (
    id text NOT NULL,
    status text NOT NULL,
    message text NOT NULL,
    saved_count integer DEFAULT 0 NOT NULL,
    skipped_count integer DEFAULT 0 NOT NULL,
    failed_count integer DEFAULT 0 NOT NULL,
    run_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.pipeline_logs OWNER TO postgres;

--
-- Name: post_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_likes (
    id integer NOT NULL,
    post_id integer NOT NULL,
    user_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.post_likes OWNER TO postgres;

--
-- Name: post_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.post_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.post_likes_id_seq OWNER TO postgres;

--
-- Name: post_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.post_likes_id_seq OWNED BY public.post_likes.id;


--
-- Name: post_recommends; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_recommends (
    id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id text NOT NULL,
    post_id integer NOT NULL
);


ALTER TABLE public.post_recommends OWNER TO postgres;

--
-- Name: post_recommends_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.post_recommends_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.post_recommends_id_seq OWNER TO postgres;

--
-- Name: post_recommends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.post_recommends_id_seq OWNED BY public.post_recommends.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    view_count integer DEFAULT 0 NOT NULL,
    author_id text,
    category_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    images text[] DEFAULT '{}'::text[],
    status text DEFAULT 'PUBLISHED'::text NOT NULL
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id text NOT NULL,
    user_id text NOT NULL,
    token_hash text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reports (
    id integer NOT NULL,
    type text NOT NULL,
    target_id integer NOT NULL,
    reason text NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    reporter_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.reports OWNER TO postgres;

--
-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_id_seq OWNER TO postgres;

--
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;


--
-- Name: system_configs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_configs (
    key text NOT NULL,
    value text NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.system_configs OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text,
    nickname text NOT NULL,
    profile_image text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    provider public."Provider" DEFAULT 'EMAIL'::public."Provider" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    ban_reason text,
    banned_until timestamp(3) without time zone,
    is_banned boolean DEFAULT false NOT NULL,
    last_login_at timestamp(3) without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: ban_histories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ban_histories ALTER COLUMN id SET DEFAULT nextval('public.ban_histories_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: comment_recommends id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_recommends ALTER COLUMN id SET DEFAULT nextval('public.comment_recommends_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: email_verifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verifications ALTER COLUMN id SET DEFAULT nextval('public.email_verifications_id_seq'::regclass);


--
-- Name: news_recommends id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_recommends ALTER COLUMN id SET DEFAULT nextval('public.news_recommends_id_seq'::regclass);


--
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- Name: post_likes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_likes ALTER COLUMN id SET DEFAULT nextval('public.post_likes_id_seq'::regclass);


--
-- Name: post_recommends id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_recommends ALTER COLUMN id SET DEFAULT nextval('public.post_recommends_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
de0396f3-6728-4581-91ce-a5c9f3350b50	305d66898a4b9aaea2ef10e2adca310561fa498320276753083c6500813d56d7	2026-05-17 09:42:39.992149+09	20260517000000_add_ban_history	\N	\N	2026-05-17 09:42:39.979832+09	1
b9cedd78-3b61-4cd1-bb16-0e89d4b823ea	9311ff926f5634ff4ce87d8a5e6834c31a8ba1ff851dd36df1360c7f09ffd690	2026-04-14 19:39:40.146866+09	20260408170420_init		\N	2026-04-14 19:39:40.146866+09	0
7766d34c-7c64-4f69-924b-ec83b94ff2e6	2310402999d13a5373f2cb6fc6ec41199579a289acb645c950d43f8c2ff92596	2026-05-19 13:20:15.412605+09	20260518000000_add_email_verification_fail_count	\N	\N	2026-05-19 13:20:15.406793+09	1
a74e4039-ac62-4ff4-bfbe-f5edea0993bb	ca483f35481e9ad4b0b311df613fd2b424351f79d740c65761577e4dc5da2558	2026-04-21 18:38:57.464804+09	20260421000000_add_news_view_count	\N	\N	2026-04-21 18:38:57.460093+09	1
51bceff0-d88b-4a74-9e3d-cfcf338d50fb	d07cf4ee28f9693bf4a5ae7d3bf060dcbb5749a62cf3f551cd2eaffe046059b1	2026-04-26 16:48:09.256485+09	20260426000000_user_delete_anonymize	\N	\N	2026-04-26 16:48:09.248002+09	1
21b54315-9889-4ace-9af8-995842a2e624	69cc6ddab37f655451341ccdef920c48db7f20a0b8274afd6bed77d2fe79fbaa	2026-04-28 14:55:29.817203+09	20260428000000_add_admin_models		\N	2026-04-28 14:55:29.817203+09	0
78ad6a6f-3eb6-4679-afda-9f4b2f3f39fd	eab1411a9c16b5bde60a02d5c47a016211ffd9809ca2d67af7faa6bae86f94e5	2026-05-08 02:03:11.501802+09	20260507000000_add_system_config		\N	2026-05-08 02:03:11.501802+09	0
b3f34034-3ebb-49a0-83c4-17e2b6a9ab29	25a0954aca4365ec0f01d502ece441b8fe27787c927a99c2b396f15b34b93b1b	2026-05-09 23:55:46.025172+09	20260509000000_init		\N	2026-05-09 23:55:46.025172+09	0
08ce2ded-4d0e-4113-8dcf-c1f3598d0f73	63a04fd7d60fde10d056841490e9af32d329c6347e6c807c8e0ecb9a75877c84	2026-05-12 13:32:28.644376+09	20260512000000_add_editor_pick_articles	\N	\N	2026-05-12 13:32:28.631119+09	1
ad9812d7-3494-47e7-92aa-0149f66d3a2e	0a85603d344c6b2a8a51624cdacbb1d62199a493cb322dfd94a713170c93f604	2026-05-19 13:25:28.759839+09	20260518010000_add_email_verification_locked_until	\N	\N	2026-05-19 13:25:28.756969+09	1
cf7e0246-2691-4adc-ba72-7cbd97bc6775	2abec6f85816962ebb2faddc517bf922834463cb06a30e4d74ddf3d6f16c3e31	\N	20260512010000_add_is_hidden_to_editor_pick_articles	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260512010000_add_is_hidden_to_editor_pick_articles\n\nDatabase error code: 42701\n\nDatabase error:\nERROR: column "is_hidden" of relation "editor_pick_articles" already exists\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42701), message: "column \\"is_hidden\\" of relation \\"editor_pick_articles\\" already exists", detail: None, hint: None, position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("tablecmds.c"), line: Some(7350), routine: Some("check_for_column_name_collision") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20260512010000_add_is_hidden_to_editor_pick_articles"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name="20260512010000_add_is_hidden_to_editor_pick_articles"\n             at schema-engine/core/src/commands/apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:226	2026-05-17 09:42:37.348289+09	2026-05-17 09:42:33.115968+09	0
010c6af3-ce0c-46a9-8061-3ed98d763034	2abec6f85816962ebb2faddc517bf922834463cb06a30e4d74ddf3d6f16c3e31	2026-05-17 09:42:37.349005+09	20260512010000_add_is_hidden_to_editor_pick_articles		\N	2026-05-17 09:42:37.349005+09	0
f8a0bc84-269d-436b-a2d4-1ae0de1884bf	28620254ade4837184bf4ad58e2bf0ddf0ab0d08276242ee1e6371d0130dc341	2026-05-19 18:09:29.208136+09	20260519000000_add_admin_id_to_ban_history	\N	\N	2026-05-19 18:09:29.201687+09	1
\.


--
-- Data for Name: ban_histories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ban_histories (id, user_id, duration, reason, banned_at, banned_until, admin_id) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, parent_id) FROM stdin;
1	모바일	mobile	\N
2	콘솔	console	\N
3	PC	pc	\N
4	Esports	esports	\N
5	리그오브레전드	league-of-legends	3
6	발로란트	valorant	3
7	오버워치	overwatch	3
8	배틀그라운드	pubg-pc	3
9	로스트아크	lost-ark	3
10	메이플스토리	maplestory	3
11	던전앤파이터	dnf	3
12	디아블로	diablo	3
13	붉은사막	crimson-desert	3
14	기타 PC	etc-pc	3
15	원신	genshin-impact	1
16	붕괴: 스타레일	honkai-star-rail	1
17	워스텔링	worthtelling	1
18	배틀그라운드 모바일	pubg-mobile	1
19	리니지M	lineage-m	1
20	나혼자만레벨업	solo-leveling	1
21	메이플스토리M	maplestory-m	1
22	승리의 여신: 니케	nikke	1
23	기타 모바일	etc-mobile	1
24	PlayStation	playstation	2
25	Xbox	xbox	2
26	Nintendo	nintendo	2
27	엘든링	elden-ring	2
28	파이널판타지	final-fantasy	2
29	기타 콘솔	etc-console	2
30	LCK	lck	4
31	VCT	vct	4
32	기타 Esports	etc-esports	4
\.


--
-- Data for Name: comment_recommends; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comment_recommends (id, created_at, user_id, comment_id) FROM stdin;
3	2026-05-17 00:12:26.472	847b6119-ff05-431d-a84b-7eff40629579	2
4	2026-05-17 00:28:10.975	a253dfa6-87b2-4627-9e3f-b179c9f1100a	2
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, content, post_id, author_id, parent_id, created_at, updated_at, deleted_at, is_hidden) FROM stdin;
1	댓글	2	847b6119-ff05-431d-a84b-7eff40629579	\N	2026-04-30 05:55:50.482	2026-04-30 05:55:54.706	2026-04-30 05:55:54.706	f
3	모르죠 ㅋㅋ	1	847b6119-ff05-431d-a84b-7eff40629579	\N	2026-05-15 06:53:17.732	2026-05-15 06:53:17.732	\N	f
4	ㄴㄴ	2	847b6119-ff05-431d-a84b-7eff40629579	\N	2026-05-17 00:12:30.435	2026-05-17 00:12:30.435	\N	f
5	어쩔	2	a253dfa6-87b2-4627-9e3f-b179c9f1100a	\N	2026-05-17 00:28:07.862	2026-05-17 00:28:07.862	\N	f
6	이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지용이건 에바지	2	847b6119-ff05-431d-a84b-7eff40629579	\N	2026-05-17 00:42:09.296	2026-05-17 00:54:28.129	\N	t
2	ㅎㅇ	2	847b6119-ff05-431d-a84b-7eff40629579	\N	2026-05-09 16:06:10.441	2026-05-17 00:55:07.387	\N	t
\.


--
-- Data for Name: editor_pick_articles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.editor_pick_articles (id, title, content, main_category, thumbnail_url, author_id, created_at, updated_at, deleted_at, is_hidden) FROM stdin;
cmp6j47sr0003ou43ecke4fjp	테스트 한다	아아 본문 테스트 이미지<img src="https://pub-49c6917413ba4a2a8195975b5928be90.r2.dev/posts/847b6119-ff05-431d-a84b-7eff40629579/5813e2f8-6bef-4f9a-a933-cba717a1524e.png" alt="업로드 이미지" />	Console	https://pub-49c6917413ba4a2a8195975b5928be90.r2.dev/posts/847b6119-ff05-431d-a84b-7eff40629579/02b7fcd0-5658-4c6a-8810-ad0c6f6e2454.png	847b6119-ff05-431d-a84b-7eff40629579	2026-05-15 06:21:14.986	2026-05-15 07:52:52.508	2026-05-15 07:52:52.507	f
cmp254xn40001f0j49kyn5fat	오늘의 에디터 픽 테스트!	오늘의 에디터 픽은 이거라고 ?!	PC	https://pub-49c6917413ba4a2a8195975b5928be90.r2.dev/posts/847b6119-ff05-431d-a84b-7eff40629579/57d0a6f8-ce94-4bb6-adb5-a2d905701047.png	847b6119-ff05-431d-a84b-7eff40629579	2026-05-12 04:38:49.095	2026-05-15 07:52:54.253	2026-05-15 07:52:54.253	t
cmp6menox00011j4vvsg1fxe4	테스트	테스트에용<img src="https://pub-49c6917413ba4a2a8195975b5928be90.r2.dev/editornews/847b6119-ff05-431d-a84b-7eff40629579/fa19dad2-7ccb-438f-9063-70c13f034a1f.png" alt="업로드 이미지" /><br />	Mobile	https://pub-49c6917413ba4a2a8195975b5928be90.r2.dev/editornews/847b6119-ff05-431d-a84b-7eff40629579/2e4497b9-7f65-44a1-9306-08a1a9717c41.png	847b6119-ff05-431d-a84b-7eff40629579	2026-05-15 07:53:20.979	2026-05-15 07:53:20.979	\N	f
\.


--
-- Data for Name: email_verifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_verifications (id, email, code, expires_at, is_verified, created_at, fail_count, locked_until) FROM stdin;
2	tjdalsquf12@naver.com	228093	2026-05-19 04:44:28.615	f	2026-05-19 04:39:28.616	0	\N
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news (id, original_title, original_link, original_pub_date, source_name, main_category, sub_category, classify_method, rewritten_title, rewritten_summary, rewritten_body, tags, status, created_at, updated_at, view_count) FROM stdin;
cmo7dva0v0000x67dgbz78739	감성 스토리게임 &#039;세이브 마이 스크랩&#039; PC판 22일 출시	https://www.gamemeca.com/view.php?gid=1774265	2026-04-20 09:11:37	게임메카	PC	기타 PC	claude	감성 어드벤처 퍼즐게임 '세이브 마이 스크랩' PC판 22일 출시	인디게임 '세이브 마이 스크랩'이 스팀으로 22일 출시, 새 엔딩과 갤러리 모드 추가	디지털터치가 어드벤처 퍼즐게임 '세이브 마이 스크랩'의 스팀 버전을 22일 발매한다. 이 게임은 무료게임 '픽스 마이 정크'를 기반으로 제작됐으며, 개발자가 직접 작성한 새로운 대사와 엔딩, 갤러리 모드 등이 추가됐다.\n\n플레이어는 안드로이드 수리공이 되어 고장 난 가사용 안드로이드 '하리마'를 수리하는 과정을 경험한다. 회로를 잇고 부품을 교체하며 기능을 되찾는 와중에 '하리마'와 의사 '미오마르'의 과거 기억이 점차 드러나며, 게임을 진행하면서 캐릭터들의 진실과 소망에 닿게 된다.\n\n개발 환경이 티라노빌더에서 유니티로 변경되면서 게임 컨트롤러 지원 등 더욱 편의성 높은 플레이 경험을 제공한다. 엔딩을 클리어하면 갤러리 모드가 해금되어 이벤트 장면과 캐릭터 설정을 감상할 수 있다.\n\n스팀 버전은 22일, 닌텐도 스위치와 PS5는 30일, Xbox 시리즈 X/S는 5월 28일에 각각 출시되며 한국어 공식 지원한다.	{인디게임,어드벤처,스팀}	PUBLISHED	2026-04-20 16:02:23.743	2026-04-20 16:02:23.743	0
cmo7dve4d0001x67dbj3ndbcc	사니양 연구실 테마, 테일즈샵 7년 만에 오프라인 행사 개최	https://www.gamemeca.com/view.php?gid=1774264	2026-04-20 09:04:39	게임메카	기타	기타 기타	claude	테일즈샵, 7년 만에 오프라인 행사 개최	스토리 중심 게임사 테일즈샵이 5월 16일 '사니양 연구실' 테마의 오프라인 이벤트를 개최한다.	스토리 중심 게임 개발사 테일즈샵이 7년 만에 대면 행사를 진행한다. 5월 16일 오후 2시 서울 흰물결 아트센터 예술극장에서 '사니양 연구실 시크릿 세미나'를 개최하며, 인기 작품 라디오의 오프라인 버전 콘셉트로 구성된다.\n\n행사에는 사니양 연구실의 주요 캐스트인 문유정, 이세레나, 권다예가 참여하며, 박시현, 성예원, 장미 등 테일즈샵 다양한 작품에 출연한 성우들이 함께한다. 토크와 함께 썸썸편의점, 랜덤채팅의 그녀, 사니양 연구실 등 주요 작품의 음악을 활용한 무대 공연도 준비된다.\n\n테일즈샵 관계자는 오랜 기간 오프라인 행사를 개최하지 못한 만큼, 이번 자리가 팬들에게 작품의 감동을 직접 전달하는 기회가 될 것이라고 설명했다. 티켓은 4월 20일부터 YES24를 통해 예매 가능하다.	{테일즈샵,게임이벤트,오프라인행사}	PUBLISHED	2026-04-20 16:02:29.053	2026-04-20 16:02:29.053	0
cmo7dvo7n0002x67dxfyubldh	다이애나의 사랑스러움은 치트였다, 프래그마타	https://www.gamemeca.com/view.php?gid=1774260	2026-04-20 08:48:54	게임메카	PC	기타 PC	claude	캡콤 프래그마타, 다이애나의 매력 뒤에 숨은 높은 완성도	달 기지를 무대로 한 캡콤의 신작 프래그마타는 소녀 캐릭터의 인기를 넘어 탄탄한 게임성으로 평가받고 있다.	캡콤의 신작 '프래그마타'는 달 기지를 배경으로 펼쳐지는 모험 게임이다. 신호 두절 사건을 조사하던 대응팀이 달 지진으로 흩어지면서 주인공 휴 윌리엄스는 기지 깊은 곳으로 떨어진다. 그곳에서 만난 안드로이드 소녀 D-I-0336-7에게 다이애나라는 이름을 지어주고, 함께 기지 탈출을 시도하게 된다.\n\n게임은 휴와 다이애나가 달 기지 각 구역을 돌아다니며 협력하는 과정을 중심으로 진행된다. 두 주인공이 대화를 나누고 감정을 교류하면서 관계가 깊어지는 동안, 인공지능 IDUS의 위협과 또 다른 프래그마타 에이트의 등장으로 기지의 비밀들이 하나둘 드러난다. 스토리는 개발사가 신중하게 짜낸 흐름 속에서 자연스럽게 전개된다.\n\n프래그마타는 출시 전부터 주인공 다이애나의 매력으로 큰 인기를 얻었다. 발매 연기 때마다 애정 어린 메시지와 함께 모습을 드러내며 게이머들의 기대감을 높였다. 하지만 실제 게임은 이러한 캐릭터 마케팅을 훨씬 뛰어넘는 완성도를 갖췄으며, 후속작을 바라게 할 정도의 작품성을 선보이고 있다.	{프래그마타,캡콤,PC}	PUBLISHED	2026-04-20 16:02:42.131	2026-04-20 16:02:42.131	0
cmo7dvtcl0003x67dex3qgyxy	[오늘의 스팀] 유저 적대적 패치, 슬더스 2 평가 또 &#039;나락&#039;	https://www.gamemeca.com/view.php?gid=1774259	2026-04-20 08:33:35	게임메카	PC	기타 PC	claude	슬레이 더 스파이어 2, 유저 반발 패치로 평가 급락	슬레이 더 스파이어 2가 밸런스 패치 이후 유저 평가가 '부정적'으로 급변했다.	슬레이 더 스파이어 2가 지난 4월 17일 적용한 밸런스 패치 이후 스팀 유저들의 평가가 급락했다. 발매 직후 '압도적으로 긍정적'이던 평가가 최근 한 달간 '복합적(52% 긍정)'으로 내려앉은 것으로, 개발진의 패치 방향성에 대한 광범위한 불만이 표출되고 있다.\n\n논란의 핵심은 유저에게만 불리한 방향의 밸런스 조정이다. 인기 전술인 '무한덱'은 너프되는 한편, 이를 견제하는 보스 '문을 만드는 자'는 상향됐다. 다수의 유저들은 이 같은 조정이 불합리하다고 느끼고 있으며, PvE 게임임에도 불구하고 플레이어에게 지속적으로 불리한 패치를 밀어붙이는 개발진의 의도를 의문시하는 목소리까지 나왔다.\n\n발매 이후 3월까지 28만 명 이상의 동시접속자를 유지하며 인디게임 대표작으로 자리잡았던 만큼, 이번 평가 하락은 개발진의 밸런스 철학에 대한 재검토 필요성을 제기하고 있다. 개발진은 지난 4월 18일 스팀 창작마당 지원, 다국어 지원, 몬스터 도감, 실험적 게임 모드 추가 등의 계획을 발표했다.	{"슬레이 더 스파이어 2",스팀,"밸런스 패치"}	PUBLISHED	2026-04-20 16:02:48.79	2026-04-20 16:02:48.79	0
cmo7dx3eu000dx67dqgjs7f3s	한국게임학회와 넥슨게임즈, 대학생 디지털아트 공모	https://www.gamemeca.com/view.php?gid=1774243	2026-04-20 05:37:58	게임메카	기타	기타 기타	claude	한국게임학회·넥슨게임즈, 대학생 디지털아트 공모전 5월 10일까지 접수	차세대 디지털 아티스트 발굴 위한 공모전 개최, AI·Non-AI 부문 모두 참여 가능	한국게임학회와 넥슨게임즈가 공동으로 개최하는 '2026 전국 대학생 디지털 아트 공모전'이 5월 10일 자정까지 작품을 모집한다. 전국 대학 및 이에 준하는 교육기관의 재학생·휴학생이면 누구나 참여할 수 있으며, AI 부문과 Non-AI 부문을 모두 개설해 다양한 형태의 디지털 아트 출품을 받는다.\n\n콘셉트 아트와 3D 렌더링 등 모든 형태의 디지털 아트가 대상이며, 한국 고유의 문화적 가치를 담은 작품에는 특별 가산점이 부여된다. 수상작은 5월 18일 발표되며, 대상 수상자에게는 30만 원, 최우수상 수상자에게는 20만 원, 우수상 수상자에게는 10만 원이 지급된다.\n\n수상 작품들은 내년 8월 부산에서 개최되는 BIC 2026 아트전 후보작으로 연계되는 등 국제 무대로의 진출 기회를 제공받게 된다. 조직위원장은 이번 공모전이 한국 디지털 아트의 새로운 가능성을 보여주는 계기가 될 것으로 기대했다.	{공모전,디지털아트,대학생,한국게임학회,넥슨게임즈}	PUBLISHED	2026-04-20 16:03:48.486	2026-04-20 16:03:48.486	0
cmo7dvxqp0004x67d1gofwddm	더 파이널스, 글로벌 e스포츠 &#039;통합 리그 체제&#039;로 개편	https://www.gamemeca.com/view.php?gid=1774258	2026-04-20 08:30:35	게임메카	기타	기타 기타	claude	더 파이널스, 글로벌 3개 권역 통합 리그 체제 시작	넥슨의 더 파이널스 e스포츠가 APAC, 미주, 유럽·중동·아프리카 3개 권역의 통합 리그로 개편되며 5월 개막	넥슨은 더 파이널스 e스포츠를 글로벌 통합 리그 체제로 전환한다고 밝혔다. 아시아 태평양(APAC), 미주(AMERICAS), 유럽·중동·아프리카(EMEA) 3개 권역에서 동시에 운영되며, 연간 총상금 20만 달러 규모의 대회다. 각 지역에서 4회의 사이클을 거쳐 최종적으로 11월 그랜드 메이저에서 각 권역 최강팀들이 만난다.\n\n각 사이클은 3주간 온라인으로 진행되며 스위스 단계, 톱 16 스테이지, 결승전으로 구성된다. 최대 256개 팀이 참여할 수 있는 오픈 토너먼트에서 시작해 상위 팀들이 단계별로 올라간다. 지역별 누적 포인트 1위 팀은 그랜드 메이저에 직행하고, 2~9위 팀은 퀄리파이어를 통해 본 대회 진출권을 경쟁한다.\n\n한국은 APAC 리그에 속하며 중국, 일본, 동남아시아 팀들과 경합한다. APAC 첫 사이클은 5월 16일 개막하고 결승전은 5월 30일에 개최된다. 올해 그랜드 메이저는 11월 27일부터 29일까지 드림핵 스톡홀름에서 열리며 총상금 15만 달러 규모다.	{"더 파이널스",e스포츠,"글로벌 리그"}	PUBLISHED	2026-04-20 16:02:54.481	2026-04-20 16:02:54.481	0
cmo7dwdp00007x67du4sqrmja	[숨신소] 아케이드 감성 담은 8비트 방치형 &#039;루트 루프&#039;	https://www.gamemeca.com/view.php?gid=1774251	2026-04-20 07:51:06	게임메카	기타	기타 기타	claude	8비트 감성의 방치형 클리커 '루트 루프', 스팀에서 화제	던전 크롤링과 방치형 게임을 결합한 '루트 루프'가 스팀에서 주목받고 있다.	스팀에 출시된 '루트 루프'는 방치형 클리커 게임에 던전 크롤링 요소를 녹인 타이틀이다. 플레이어는 기사부터 시작해 궁수, 마법사, 힐러를 순차적으로 개방하며 4인 파티를 구성해 던전의 끝을 목표로 진행한다. 전리품을 수집한 뒤 던전으로 재진입하는 반복적 구조로 직관적인 보상감을 제공한다.\n\n게임은 5분 이내의 빠른 던전 진입으로 설계돼 짧은 플레이 시간과 낮은 피로도를 자랑한다. 수집한 재화는 스킬 트리에 투자해 체력, 공격력, 방어력 같은 기초 능력부터 재화 획득량 증가나 액티브 스킬 유지 시간 연장 같은 심화 특성까지 다양하게 강화할 수 있다. 게임이 진행될수록 획득 가능한 새로운 재화와 스킬이 해금되며 점진적인 성장을 경험하게 된다.\n\n8비트 그래픽으로 표현된 아케이드 감성과 중독성 있는 게임성으로 스팀 게이머들에게 긍정적인 평가를 받고 있다. 이 작품은 최근 스팀에 출시된 여러 독특한 게임들 중에서도 접근성과 반복성의 균형을 잘 맞춘 타이틀로 인정받고 있다.	{방치형,클리커,던전크롤링,인디게임,스팀}	PUBLISHED	2026-04-20 16:03:15.156	2026-04-20 16:03:15.156	0
cmo7dw3jh0005x67dyw12lf89	배틀필드 6, 연내 해상전과 전장 7종 추가한다	https://www.gamemeca.com/view.php?gid=1774256	2026-04-20 08:15:41	게임메카	Console	기타 Console	claude	배틀필드 6, 2026년 해상전과 7개 신규 맵 추가 로드맵 공개	EA가 배틀필드 6의 연간 업데이트 계획을 발표, 해상전 도입과 7종의 새로운 전장을 추가할 예정	EA가 배틀필드 6의 2026년 업데이트 계획을 공개했다. 올해 중으로 해상 전투를 본격 도입하고 총 7개의 신규 전장을 추가하며, 유저 요청 기능들을 구현해 게임의 전술 폭을 크게 확대한다는 전략이다.\n\n상반기 시즌 3에는 배틀필드 4의 명작 지도를 재해석한 '골무드 철로'가 등장한다. 기존 최대 맵보다 4배 큰 규모로 제작되어 시리즈 최대 크기 기록을 갱신할 예정이며, 도시 전투를 강조한 카이로 바자르도 함께 출시된다. 아울러 배틀로얄 솔로 모드가 공식 추가되고 랭킹 시스템이 순차 도입된다. 7월 시즌 4부터는 해상전이 중심이 된다. 웨이크 섬 등 상징적 맵들이 복귀하며 실제 작동하는 비행 갑판, 새로운 해상 장비, 동적 파도 시스템이 추가되어 육해공이 통합된 입체적 교전을 펼칠 수 있다.\n\n연말까지 진행되는 시즌 5에서는 미공개 지도 3개가 완성되면서 신규 맵 총 7종이 마무리된다. 동시에 커뮤니티 요청사항들도 반영된다. 영구 서버 설정, 커스텀 로비, 플래툰 시스템, 근접 음성 채팅 등이 도입되어 전략적 소통과 분대 결속이 강화되며, 기존 맵 2곳도 리워크 작업을 거친다.	{배틀필드6,로드맵,신규맵,해상전,EA}	PUBLISHED	2026-04-20 16:03:01.998	2026-04-21 11:09:23.675	1
cmpcj0f35002caa8ajcov36v5	Xbox 'Investigating' Issue With Passwords Not Working On Consoles	https://www.purexbox.com/news/2026/05/xbox-investigating-issue-with-passwords-not-working-on-consoles	2026-05-15 17:57:00	Pure Xbox	Console	Xbox	fixed	Xbox 콘솔 로그인 오류 대규모 발생... 마이크로소프트 '원인 규명 중' 공식 발표	Xbox 콘솔에서 정확한 비밀번호가 거부되는 광범위한 로그인 오류가 발생 중이며, 마이크로소프트 지원팀이 공식 조사를 진행 중입니다. 임시 해결책으로 비밀번호 재설정 및 패스키 로그인 전환을 권장하고 있습니다.	Xbox 콘솔 사용자들이 이번 주 정확한 비밀번호를 입력했음에도 '비밀번호가 올바르지 않습니다'라는 오류 메시지를 반복 수신하는 광범위한 로그인 문제를 겪고 있습니다. Xbox 지원팀이 공식 성명을 발표해 해당 문제를 적극적으로 조사 중임을 확인했으며, 플랫폼 전반에 영향을 미치는 인증 시스템 장애로 추정됩니다.\n\n마이크로소프트는 근본 원인 파악에 최소 수 일이 소요될 것으로 예상하고 있으며, 그 사이 사용자들에게 두 가지 임시 해결책을 제시했습니다. 첫째는 Xbox 공식 웹사이트를 통해 계정 비밀번호를 초기화하는 방법이고, 둘째는 비밀번호 없이 생체인증이나 일회용 코드 기반 인증(패스키)으로 전환하는 것입니다. 이러한 조치는 인증 데이터베이스의 일시적 오류 또는 API 동기화 문제로 인한 것으로 보이며, 클라우드 기반 인증 시스템을 운영하는 마이크로소프트의 글로벌 서버 환경에서 광범위한 검증이 필요한 상황입니다.\n\n이번 사건은 클라우드 기반 디지털 플랫폼 의존도가 높은 현세대 콘솔 생태계의 취약점을 노출시킵니다. Xbox Game Pass를 통한 정기 구독자나 디지털 구매 중심 사용자일수록 로그인 불능 시 서비스 접근이 완전히 차단되기 때문에 영향도가 높습니다. 특히 멀티플레이 게임이나 Xbox Live 서비스가 필수인 게임을 플레이하는 유저들의 불편함이 가중되고 있으며, 마이크로소프트의 신속한 패치 배포가 시급한 상황입니다.\n\n**국내 사용자 가이드**: 현재 Xbox 계정 로그인이 거부되는 경우 account.xbox.com을 통해 비밀번호를 재설정하거나, Xbox 앱 또는 콘솔 설정 메뉴에서 '패스키로 로그인' 옵션으로 전환하길 권장합니다. 한국 정식 출시된 Xbox Series X|S 콘솔의 경우 동일한 마이크로소프트 계정 시스템을 사용하므로 영향을 받을 수 있습니다. 공식 문제 해결 여부는 Xbox 지원 센터(support.xbox.com) 및 한국 Xbox 커뮤니티를 통해 최신 정보를 확인할 수 있습니다.	{Xbox,"로그인 오류","클라우드 인증","시스템 장애"}	PUBLISHED	2026-05-19 11:04:54.88	2026-05-19 11:04:54.88	0
cmo7dwied0008x67d026002ds	컴투스, &#039;컴프야·컴프야V&#039; 맞춤형 5G 요금제 발표	https://www.gamemeca.com/view.php?gid=1774241	2026-04-20 07:47:09	게임메카	기타	기타 기타	claude	컴투스, 야구 게임 이용자 위한 전용 5G 요금제 출시	컴투스프로야구 시리즈 팬들을 위한 맞춤형 5G 요금제가 5월 6일 출시된다.	컴투스가 통신 서비스 기업 더마일스와 손잡고 모바일 야구 게임 이용자 전용 5G 요금제를 선보인다. 이 요금제는 '컴투스프로야구2026'과 '컴투스프로야구V26' 팬들이 게임을 더 효율적으로 즐길 수 있도록 설계됐으며, 5월 5일까지 사전 예약을 받는다.\n\n요금제는 라이트와 플러스 두 가지로 나뉜다. 프로야구2026 이용자는 라이트 기준으로 매달 한계돌파권과 프리미엄 패키지를, V26 이용자는 게임 재화와 편의 아이템을 제공받는다. 사전 예약 기간 내 가입하면 네이버페이 포인트를 받을 수 있으며, 5개월간 월별로 게임 아이템을 지속적으로 지원받는다.\n\n더마일스는 개별 브랜드가 독립적인 통신 인프라 없이 고객 맞춤형 서비스를 제공하도록 돕는 기업이다. 이용자는 마일스클럽 플랫폼에서 요금제 개통부터 사용량 관리까지 모든 업무를 통합적으로 처리할 수 있다.\n\n컴투스는 이번 협력을 계기로 야구 팬들의 생활 방식에 맞춘 새로운 서비스 확장을 지속할 계획이다.	{컴투스,컴프야,5G요금제,모바일게임}	PUBLISHED	2026-04-20 16:03:21.253	2026-04-20 16:03:21.253	0
cmo7dwz72000cx67d736e49cm	게임물관리위원회, 센텀지구 유관기관과 단체헌혈 실시	https://www.gamemeca.com/view.php?gid=1774244	2026-04-20 05:43:39	게임메카	기타	기타 기타	claude	게임물관리위원회, 센텀지구 9개 기관과 단체헌혈 실시	게임위가 부산 센텀지구 유관기관들과 함께 혈액 수급 문제 해소를 위한 단체헌혈 진행	게임물관리위원회는 4월 17일 센텀지구 내 9개 공공기관과 함께 단체헌혈을 실시했다. 인구 고령화로 인한 헌혈자 감소에 따른 혈액 수급 문제를 해결하고 공공기관으로서 사회적 책임을 다하기 위한 행사다.\n\n게임위는 부산혈액원과 협력관계를 맺고 매년 분기별로 정기적인 단체헌혈을 진행하고 있다. 이번 행사에는 영상물등급위원회, 영화진흥위원회, 부산영상위원회 등 센텀지구 내 주요 공공기관의 임직원들이 참여해 혈액 기증에 동참했다.\n\n서태건 게임위 위원장은 "센텀지구 공공기관들이 모은 따뜻한 마음이 누군가의 생명을 살리는 데 큰 도움이 되기를 바란다"며 "지역사회와 생명나눔의 가치를 공유하며 상생하는 활동에 계속 앞장서겠다"고 말했다.	{게임물관리위원회,사회공헌,헌혈}	PUBLISHED	2026-04-20 16:03:43.023	2026-04-20 16:03:43.023	0
cmo7dwreh000ax67d4ytit9pn	뒤태가 살아있네, 승리의 여신: 니케 보드게임 사전예약	https://www.gamemeca.com/view.php?gid=1774247	2026-04-20 06:12:37	게임메카	Mobile	승리의 여신: 니케	keyword	젬블로컴퍼니, '승리의 여신: 니케' 보드게임 5월 17일까지 사전예약	모바일 게임 니케를 보드게임으로 재현한 전략 장르 신작이 사전예약 중	젬블로컴퍼니가 인기 모바일 게임 '승리의 여신: 니케'를 활용한 보드게임을 선보인다. 오는 5월 17일까지 사전예약을 진행하며, 플레이어는 지휘관이 되어 공격, 방어, 지원 타입의 니케 5기를 조합해 기계 생명체 랩쳐를 격멸하는 전략 전투를 펼친다.\n\n게임은 총 3라운드로 진행되며 마지막 라운드에서는 6종의 서로 다른 보스가 나타난다. 스킬 카드를 사용해 니케 아크릴 피규어를 뒤집어 소진 상태를 표현하고, 재장전 액션으로 재활성화하는 방식으로 진행된다. 원작과 동일하게 3단계의 버스트 레벨을 조합하거나 라운드마다 강력한 추가 공격을 쓸 수 있는 버스트 카드를 활용할 수 있다.\n\n제품에는 총 25종의 니케 아크릴 피규어가 포함되어 수집의 재미도 함께 제공한다. 젬블로컴퍼니는 원작의 매력을 오프라인 보드게임으로 완벽하게 구현하기 위해 개발했으며, 보드게임 입문자를 위한 추천 조합도 기본 제공한다.	{"승리의 여신: 니케",보드게임,젬블로컴퍼니}	PUBLISHED	2026-04-20 16:03:32.921	2026-04-21 11:05:35.051	1
cmo7dx82p000ex67dpgheesvq	라이온하트 스튜디오, 인턴십 참가자 전원 정규직으로	https://www.gamemeca.com/view.php?gid=1774240	2026-04-20 05:33:10	게임메카	기타	기타 기타	claude	라이온하트 스튜디오, 기획 인턴십 참가자 전원 정규직 전환	라이온하트 스튜디오가 4월 완료한 기획 인턴십 참가자 전원을 정규직으로 채용했다.	라이온하트 스튜디오는 1월부터 진행해온 기획 직군 인턴십을 4월 17일 마무리하고 참가자 전원을 정규직으로 전환했다. 이는 게임 개발 현장에서 신입 인재를 적극 발굴하려는 회사의 의지를 보여주는 조치다.\n\n인턴 참가자들은 '오딘: 발할라 라이징', 출시 예정인 '프로젝트 C', PC MMORPG '프로젝트 O' 등 회사의 주요 프로젝트에 배치되어 실무 경험을 쌓았다. 회사는 인턴 간 협력을 강화하기 위해 공통 과제를 도입했으며, 선배 개발자와의 '레벨업! 티타임' 프로그램을 통해 경험 공유와 커리어 상담도 제공했다.\n\n라이온하트 스튜디오는 2019년부터 기획 직군 대상 인턴십을 운영해왔으며, 이를 통해 신입 개발자 육성에 집중하고 있다. 회사 관계자는 앞으로도 인턴십 프로그램을 지속적으로 확대하여 현장 경험 기회를 제공하겠다고 밝혔다.	{"라이온하트 스튜디오","게임업계 채용","인턴십 정규직 전환"}	PUBLISHED	2026-04-20 16:03:54.529	2026-04-20 16:03:54.529	0
cmo7dxgtn000gx67dtu3nrt12	넷마블 왕좌의 게임 신작, 5월 14일 PC로 먼저 출시	https://www.gamemeca.com/view.php?gid=1774238	2026-04-20 05:22:08	게임메카	PC	기타 PC	claude	넷마블 '왕좌의 게임: 킹스로드' PC 버전 5월 14일 출시	넷마블의 오픈월드 액션 RPG '왕좌의 게임: 킹스로드'가 PC 버전 5월 14일, 모바일 5월 21일 출시된다.	넷마블이 '왕좌의 게임' 시리즈를 기반으로 개발 중인 오픈월드 액션 RPG '왕좌의 게임: 킹스로드'의 PC 버전을 5월 14일에 먼저 선보인다. 모바일 버전은 일주일 뒤인 5월 21일에 출시될 예정이며, 공식 라이선스를 통해 원작의 세계관과 캐릭터들을 재현하는 데 중점을 두었다.\n\nPC 환경에 최적화된 조작감이 게임의 중심이다. 개발진은 키보드와 마우스를 기준으로 전투 설계와 UI를 구성했으며, 기사·용병·암살자 3개 클래스로 차별화된 액션을 경험할 수 있도록 설계했다. 4명이 참여하는 '기억의 제단', 2인 협력 콘텐츠인 '정예의 은신처', 레이드형 '심연의 제단' 등 다양한 게임 모드를 제공한다.\n\n현재 사전예약이 진행 중이며, PC 예약자에게는 북부 의상 코스튬, 비약 선택 꾸러미 10개, 나이트워치 보급품 상자 5개 등의 보상이 주어진다. 수익 모델은 월정액, 패스, 꾸미기 아이템 중심으로 설계되었다.	{넷마블,왕좌의게임,액션RPG}	PUBLISHED	2026-04-20 16:04:05.867	2026-04-20 16:04:05.867	0
cmo7dygn3000mx67ds3p2h73v	카오스 제로 나이트메어, 하프 애니버서리 오프라인 카페 오픈	https://www.gamemeca.com/view.php?gid=1774226	2026-04-20 02:10:43	게임메카	기타	기타 기타	claude	카오스 제로 나이트메어, 출시 반주년 기념 홍대 팝업 카페 개장	스마일게이트의 다크 판타지 RPG가 반주년을 맞아 4월 25일부터 홍대에서 테마 카페를 운영한다.	스마일게이트의 다크 판타지 로그라이크 RPG '카오스 제로 나이트메어'가 출시 반주년을 기념해 홍대입구역 인근 카페에서 테마 팝업을 개장한다. '나이트메어 가든 티파티'로 명명된 이번 행사는 4월 25일부터 5월 5일까지 11일간 운영되며, 네이버 예약을 통해 입장할 수 있다.\n\n카페에서는 게임의 주요 전투원 특성을 표현한 디저트 메뉴와 함께 '붕괴' 콘셉트 특별 세트를 제공한다. 세트 메뉴 구매 시 컵홀더와 테이블 매트 등의 굿즈를 증정하며, 붕괴 메뉴를 주문하는 고객에게는 홀로그램 포토카드를 선물한다. 현장에는 굿즈샵도 운영돼 아크릴 스탠드, 키홀더, 캔뱃지 등 다양한 상품을 구매할 수 있다.\n\n행사 기간 중 유명 코스프레 모델들이 게임의 인기 요원으로 변신해 셀피와 포토 이벤트를 진행한다. 또한 4월 28일 저녁에는 게임의 최신 업데이트를 함께 시청하는 라이브 뷰잉 파티도 열릴 예정이다.	{"카오스 제로 나이트메어",팝업카페,스마일게이트}	PUBLISHED	2026-04-20 16:04:52.288	2026-04-20 16:04:52.288	0
cmo7dxc3r000fx67d872l73cw	스테이지 1 첫 승, 농심 레드포스 VCT서 젠지 꺾었다	https://www.gamemeca.com/view.php?gid=1774239	2026-04-20 05:26:42	게임메카	Esports	LCK	keyword	농심 레드포스, VCT 퍼시픽 스테이지 1 첫 승리 거두며 젠지 격파	농심 레드포스가 젠지를 2-0으로 격파하며 스테이지 1 첫 승리를 거두고 플레이오프 진출 가능성을 높였다.	농심 레드포스가 17일부터 19일까지 서울 에스플렉스센터에서 열린 VCT 퍼시픽 스테이지 1 3주 차 경기에서 젠지를 2대 0으로 완승하며 스테이지 1 첫 승리를 손에 넣었다. 이 승리로 팀은 플레이오프 진출을 향한 첫 발판을 마련했다.\n\n농심 레드포스는 인원 변화를 통해 경기력을 되살렸다. 담비 대신 프란시스를 네온 포지션에 투입한 선택이 주효했으며, 프란시스는 1세트 펄 맵에서 22킬을 기록해 13대 8 승리를 이끌었다. 2세트 브리즈에서는 아이비가 바이퍼로 활약하며 16라운드 만에 23킬을 달성해 13대 3 압승을 견인했다.\n\n같은 날 키움 DRX와 T1도 각각 2대 0 완승을 거두며 3승을 기록했다. 키움 DRX는 알파조 경기에서 마코의 활약으로 글로벌 이스포츠를 꺾고 알파조 단독 1위에 올랐으며, T1은 렉스 리검 퀀과의 경기에서 먼치킨의 리더십을 앞세워 승리를 거두었다.	{VCT,발로란트,"농심 레드포스",LCK}	PUBLISHED	2026-04-20 16:03:59.751	2026-04-21 14:24:55.266	1
cmo7dxrld000ix67dj1almd22	SOOP, 아시아 e스포츠 대회 제작 총괄 및 중계	https://www.gamemeca.com/view.php?gid=1774230	2026-04-20 03:21:16	게임메카	Esports	기타 Esports	claude	SOOP, 2026 아시아 e스포츠 대회 전 경기 제작·중계 담당	SOOP이 4월 25~26일 진주에서 열리는 아시아 e스포츠 대회의 방송 제작과 공식 중계를 총괄한다.	SOOP이 2026 아시아 e스포츠 대회(ECA 2026)의 국내 및 글로벌 방송을 전면 담당한다. 문화체육관광부 주최, 한국e스포츠협회와 경상남도·진주시 주관으로 열리는 이번 대회는 한국, 중국, 일본, 베트남, 태국, 필리핀, 몽골 등 아시아 7개국이 참가하는 국가 대항전이다. SOOP은 4월 25일 개막식부터 26일 폐막식까지 경남 진주시 진주실내체육관에서 진행되는 모든 경기를 제작하며, SOOP과 한국e스포츠협회 공식 채널을 통해 생중계한다.\n\n이번 대회에는 약 150명의 국가대표 선수단이 총 7개 종목에서 경쟁한다. 배틀그라운드 모바일, 스트리트 파이터 6, e풋볼 시리즈, 킹 오브 파이터즈15, 철권8, 스테핀에 더해 이터널 리턴이 처음으로 정식 종목으로 채택됐다. 개막식과 폐막식 진행은 전용준 캐스터와 진세민 아나운서가 맡는다.\n\n2021년 한중일 e스포츠 대회로 출발한 이 대회는 지난해부터 아시아권 전체로 확대됐으며, 3년 만에 국내 개최를 성사시켰다. SOOP은 중계 기간 동안 드롭스 이벤트와 함께 승부 예측, 한국 대표팀 최종 순위 맞추기 등 다양한 참여 이벤트를 운영한다.	{SOOP,"아시아 e스포츠 대회","e스포츠 중계"}	PUBLISHED	2026-04-20 16:04:19.825	2026-04-20 16:04:19.825	0
cmo7dxwkm000jx67dcqxu8gzx	어반 오픈월드 기대작 &#039;이환&#039; 사전예약 3,500만 명 돌파	https://www.gamemeca.com/view.php?gid=1774229	2026-04-20 02:18:03	게임메카	기타	기타 기타	claude	어반 오픈월드 RPG '이환' 사전예약 3,500만 명 돌파	초자연 소재의 도시 오픈월드 RPG '이환'이 사전예약 3,500만 명을 넘어섰으며, 4월 29일 정식 출시를 앞두고 있다.	초자연 어반 오픈월드 RPG '이환'의 개발사 호타 스튜디오가 4월 18일 프리뷰 방송을 통해 게임의 세계관과 플레이 시스템을 공개했다. 방송에서는 헤테로 시티를 배경으로 한 다양한 콘텐츠가 선보였으며, 게임은 공식 홈페이지 기준 사전예약자 수 3,500만 명을 기록했다.\n\n이환은 플레이어의 라이프스타일과 진행 속도에 맞춘 높은 자유도를 특징으로 한다. 차량의 외관과 주행감을 자유롭게 커스터마이징할 수 있으며, 포르쉐와의 컬래버를 예고했다. 펜트하우스부터 산속 별장까지 다양한 형태의 주택을 구매하고 꾸밀 수 있는 저택 시스템과 캐릭터를 초대하는 기능도 제공된다.\n\n캐릭터와의 상호작용은 게임의 핵심 요소다. 인연 콘텐츠가 대폭 개선되어 더 풍부한 음성과 모션 디테일을 갖추게 되었으며, 플레이어가 캐릭터를 특정 장소로 초대하거나 일상 속에서 자연스럽게 만날 수 있도록 설계되었다. 한국어 자막과 더빙을 지원하여 로컬화에도 신경을 썼다.\n\n이환은 4월 29일 멀티 플랫폼으로 정식 출시될 예정이다.	{이환,"오픈월드 RPG","2026년 출시"}	PUBLISHED	2026-04-20 16:04:26.277	2026-04-20 16:04:26.277	0
cmpcj0pv4002daa8asqlay70e	'Dear Asha...' - Xbox Fan Desperately Wants New CEO To Remove Irrelevant Ads From Dashboard	https://www.purexbox.com/news/2026/05/dear-asha-xbox-fan-desperately-wants-new-ceo-to-remove-irrelevant-ads-from-dashboard	2026-05-15 17:00:00	Pure Xbox	Console	Xbox	fixed	Xbox 대시보드 광고 논란 심화... 신임 CEO에 '불필요한 광고 제거' 요청 청원	Xbox 커뮤니티에서 대시보드의 무분별한 광고 노출에 대한 불만이 고조되고 있으며, 팬들이 신임 CEO 아샤 샤르마에게 광고 정책 개선을 공식 요청하는 상황까지 발전했다.	Xbox 대시보드의 광고 정책이 커뮤니티의 주요 불만사항으로 대두되고 있다. 최근 한 Xbox 유저가 신임 CEO 아샤 샤르마에게 직접 호소하며 '사용자와 무관한 광고'의 제거를 요청했다. 특히 맥도날드의 스파이시 맥크리스피 광고가 홈 화면에 반복 노출되는 사례가 촉발제가 되었으며, 이는 Xbox 커뮤니티 내에서 광고 관련 불평이 주기적으로 터져 나오는 현상 중 하나로 평가된다.\n\nXbox 대시보드 광고 문제는 단순한 UI 불편함을 넘어 사용자 경험(UX) 저하로 직결되고 있다. 구독 서비스인 Xbox Game Pass Ultimate를 결제한 사용자마저도 별도의 광고 차단 옵션 없이 노출되는 광고를 감시해야 하는 상황이다. 특히 반복되는 음식점 광고처럼 사용자 관심사와 무관한 콘텐츠가 우선 노출되는 알고리즘 방식은 프리미엄 구독자의 만족도를 크게 해칠 수 있다.\n\n마이크로소프트의 광고 정책은 Xbox 게임 패스 가입자 확대와 플랫폼 수익성 강화라는 경영 목표와 맞닿아 있다. 그러나 소니의 PlayStation Plus와의 경쟁이 심화되는 현 시점에서 사용자 만족도 저하는 구독 이탈로 이어질 가능성이 높다. 신임 CEO의 리더십 아래 대시보드 광고의 타게팅 정확도 개선, 프리미엄 멤버십 대상 광고 최소화 정책 등 실질적 개선이 요구되는 상황이다.\n\n현재 Xbox 대시보드의 광고 제거 기능은 별도로 제공되지 않으며, 사용자는 설정 메뉴를 통해 '맞춤형 광고' 비활성화만 가능하다. 다만 이는 광고 노출 자체를 차단하는 것이 아닌 타게팅 기준만 조정하는 수준이다. 향후 마이크로소프트가 Game Pass 가입자를 대상으로 광고 차단 옵션을 추가하거나, 대시보드 광고의 관련성 개선 업데이트를 배포할 경우 커뮤니티의 반응이 변할 것으로 예상된다.	{Xbox,"대시보드 광고","사용자 경험(UX)","Game Pass","구독 서비스","플랫폼 정책",글로벌뉴스}	PUBLISHED	2026-05-19 11:05:08.849	2026-05-19 11:05:08.849	0
cmpcj11en002eaa8ansd08ei7	Batman: Arkham Knight Joins Xbox Play Anywhere, And More Major Titles Could Be On The Way	https://www.purexbox.com/news/2026/05/batman-arkham-knight-joins-xbox-play-anywhere-and-more-major-titles-could-be-on-the-way	2026-05-15 15:45:00	Pure Xbox	Console	Xbox	fixed	Xbox Play Anywhere, 고전 액션 게임 '배트맨: 아캄 나이트' 레트로 지원... 차세대 핸드헬드 대비 신호?	2015년 출시작 '배트맨: 아캄 나이트'가 Xbox Play Anywhere 프로그램에 소급 적용되면서, 마이크로소프트가 과거 게임 자산을 핸드헬드 플랫폼으로 확대할 준비 중일 가능성이 제기됐다.	마이크로소프트가 Xbox Play Anywhere 정책을 대폭 확대하고 있다. 지난주 공식 발표에 따르면 2015년 출시된 '배트맨: 아캄 나이트'가 새로이 Play Anywhere 적용을 받아, 콘솔 구매 시 PC 버전이 무료로 제공되기 시작했다. 이는 기존 관행을 깨는 결정으로, Xbox Play Anywhere는 주로 신작 게임에만 적용되어 왔다. 다만 '호그와트 레거시' 같은 예외 사례가 있긴 했으나, 8년 전 출시작까지 역으로 지원하는 것은 이례적이다.\n\n주목할 점은 레딧 커뮤니티에서 포착된 '숨겨진 핸드헬드 태그(invisible handheld tags)' 정보다. 사용자들이 배트맨: 아캄 나이트를 비롯한 다수 게임에서 해당 메타데이터를 발견했으며, 이는 향후 Xbox의 휴대형 게이밍 기기(예상 제품명: Xbox 핸드헬드) 출시를 대비한 기술적 사전 작업으로 해석된다. '발더스 게이트 3' 같은 AAA급 타이틀도 유사한 태깅 처리 중일 가능성이 제기되고 있다.\n\n이는 마이크로소프트의 장기적 생태계 전략을 드러낸다. 과거 게임 라이브러리를 신규 하드웨어로 확대 호환함으로써 플랫폼 이동 진입장벽을 낮추려는 의도로 보인다. Xbox Game Pass와의 시너지도 주목되는데, 구독자들이 콘솔, PC, 향후 핸드헬드 기기 전역에서 동일한 게임군에 접근할 수 있게 하려는 '크로스 플랫폼 통합' 전략의 일환으로 평가된다.\n\n국내 기준 '배트맨: 아캄 나이트'는 Xbox Game Pass 구독자라면 별도 비용 없이 이용 가능하며, 비구독자의 경우 Xbox 스토어 및 Steam에서 정가 약 6,900원대에 구매할 수 있다. PC 버전 구매 시 무료 Xbox 버전 제공 및 그 역도 성립하며, 한국어 자막 완전 지원된다. 향후 Xbox 핸드헬드 출시 일정은 아직 공식 발표되지 않았으나, 현재 진행되는 게임 태깅 작업으로 미루어 2-3년 내 정보 공개 가능성이 있다.	{Xbox,"배트맨: 아캄 나이트","Play Anywhere","Xbox 핸드헬드","크로스 플랫폼","Xbox Game Pass"}	PUBLISHED	2026-05-19 11:05:23.807	2026-05-19 11:05:23.807	0
cmo9qzdt80020t4szrcmc5j4g	Dang, We Got An Elden Ring Movie Release Date Before The Switch 2 Port	https://www.nintendolife.com/news/2026/04/dang-we-got-an-elden-ring-movie-release-date-before-the-switch-2-port	2026-04-20 15:00:00	Nintendo Life	Console	Nintendo	fixed	엘든링 영화가 Switch 2 포트보다 먼저 개봉 확정	밴다이남코, 2028년 3월 엘든링 영화 개봉일 공식 발표	밴다이남코가 A24 제작의 엘든링 영화 개봉일을 2028년 3월 3일로 확정했다. 알렉스 갈랜드 감독이 메가폰을 잡은 이 영화는 IMAX 포맷으로도 제작되어 광활한 풍경의 웅장한 장면들을 대사관에서 경험할 수 있을 것으로 예상된다.\n\n흥미로운 점은 엘든링의 Nintendo Switch 2 포트 소식보다 영화의 정확한 개봉일이 먼저 발표되었다는 것이다. 영화는 2026년 봄부터 본격적인 제작에 들어갈 예정이며, 캐스팅도 이미 확정된 상태다.\n\n엘든링은 출시 후 여러 플랫폼으로의 이식이 논의되어 왔는데, 이번 영화 개봉일 확정은 게임의 확장보다 영화 프로젝트가 더 구체적으로 진행되고 있음을 시사한다.	{엘든링,영화,Nintendo,A24}	PUBLISHED	2026-04-22 07:45:02.637	2026-05-07 17:26:27.729	2
cmpcj1bnk002faa8a1uvr9pe6	Hell Let Loose: Vietnam Finally Brings Another Vietnam-Themed FPS To Xbox Next Month	https://www.purexbox.com/news/2026/05/hell-let-loose-vietnam-finally-brings-another-vietnam-themed-fps-to-xbox-next-month	2026-05-15 14:30:00	Pure Xbox	Console	Xbox	fixed	Xbox, 베트남전 테마 대작 FPS 'Hell Let Loose: Vietnam' 내년 6월 18일 출시 확정	Xbox 플랫폼에서 베트남전을 배경으로 한 대규모 멀티플레이어 FPS 'Hell Let Loose: Vietnam'이 2026년 6월 18일 정식 출시된다. 기존 WW2·현대전 중심의 Xbox FPS 라인업에서 베트남전 시대라는 차별화된 배경 설정으로 주목받고 있다.	Xbox 게이머들이 오랫동안 기다려온 베트남전 테마 FPS가 드디어 플랫폼 진출을 확정했다. Team17에서 개발하는 'Hell Let Loose: Vietnam'은 기존 'Hell Let Loose' 프랜차이즈를 베트남전 시대로 확장한 작품으로, 2026년 6월 18일 Xbox One 및 Xbox Series X|S에서 공식 출시될 예정이다. 현재 Xbox 플랫폼에서는 콜 오브 듀티, 배틀필드 등 현대전·미래전 소재 슈터가 주를 이루고 있어, 베트남전이라는 역사적 배경을 다루는 FPS의 진출은 장르의 다양성 확보 차원에서 의미가 있다.\n\n이번 출시작은 단순한 시대 배경 변경을 넘어, 베트남전 당시의 지형과 환경, 역사적 무기 체계, 운영 개념(가제트)을 충실히 구현한 것으로 알려졌다. Hell Let Loose 시리즈의 특징인 대규모 64~100인 이상의 동시 접속 인원 기반 전술 멀티플레이 시스템이 유지되며, 정글 지형, 보병진지, 마을 지역 등 베트남전 전장의 특수한 환경을 반영한 맵 디자인이 강조되고 있다. 기존 WW2 배경의 원작과 달리, 게릴라전 개념의 전술 요소와 소수 저항군 진영의 비대칭 게임플레이가 추가될 것으로 예상된다.\n\n이 출시는 Microsoft의 Xbox 게임 라인업 다양화 전략의 일환으로 해석된다. 현재 Xbox Game Pass 내 FPS 콘텐츠는 주로 Activision 블리자드(콜 오브 듀티 시리즈), 번지(Destiny 2) 등 대형 퍼블리셔 작품에 편중되어 있는데, Hell Let Loose: Vietnam 같은 중형급 전술 슈터의 유입은 구독자층의 장르 선호도를 고려한 포트폴리오 확대를 의미한다. 특히 1인칭 슈터에서 소수의 매니아층이 강한 전술 기반 게임플레이가 강화되면서, 기존 대중 지향 FPS와의 차별성도 부각될 전망이다.\n\n**국내 정식 공개 정보**: 현재까지 한국어 자막 지원 여부에 대한 공식 발표는 없으며, 정식 국내 판매가는 미정 상태다. Xbox Game Pass 가입자들의 경우 출시일 당일 플레이 가능 여부는 Team17의 추후 공지에 달려있다. Xbox 스토어(Microsoft Store) 및 Steam(PC 출시 예정)을 통해 구매 가능할 것으로 예상되며, 국내 유저는 게임 설정에서 영문 인터페이스 사용 후 자막 선택 옵션 확인을 권장한다.	{Xbox,"Hell Let Loose: Vietnam",FPS,멀티플레이,"2026년 6월 출시","베트남전 테마"}	PUBLISHED	2026-05-19 11:05:37.088	2026-05-19 11:05:37.088	0
cmo7dylus000nx67dgglwc3ac	그라비티, 홍콩 국제 라이선싱 쇼 2026 출품한다	https://www.gamemeca.com/view.php?gid=1774224	2026-04-20 01:50:57	게임메카	기타	기타 기타	claude	그라비티, 홍콩 라이선싱 쇼 2026 참가 라그나로크 등 5개 IP 전시	그라비티가 4월 홍콩 국제 라이선싱 쇼에 라그나로크 등 5종 IP를 출품해 글로벌 사업 확대에 나선다.	그라비티는 오는 4월 27일부터 29일까지 홍콩에서 개최되는 국제 라이선싱 쇼 2026에 참가한다고 밝혔다. 회사는 라그나로크, 라그나로크 몬스터즈, 레퀴엠, 드래고니카 등 총 5종의 IP를 선보이며 라이선시와 유통업체를 대상으로 비즈니스 기회를 모색할 예정이다.\n\n이번 행사에서 특히 주목할 부분은 라그나로크 몬스터즈 애니메이션 사업 확대다. 그라비티는 가족 대상 애니메이션 '라그나로크 몬스터즈 마법 대소동!' 시즌 1 전체 50편을 출품하며, 방영사 협력사를 찾기 위한 미팅을 집중 추진한다. 동시에 극장판 신규 영상 제작도 논의할 계획이다.\n\n라그나로크 IP는 게임을 넘어 오케스트라 콘서트, OST 발매, 웹툰, 뮤지컬 등으로 다각화되고 있다. 또한 레퀴엠 온라인의 모바일 버전인 '레퀴엠M'의 사전 예약이 진행 중이며, 드래고니카 같은 클래식 게임의 IP도 함께 글로벌 시장 진출을 노린다. 그라비티는 2023년부터 4년 연속 이 행사에 참여해 지속적으로 신규 파트너십을 구축하고 있다.	{그라비티,라그나로크,"IP 라이선싱",애니메이션}	PUBLISHED	2026-04-20 16:04:59.044	2026-04-20 16:04:59.044	0
cmo7dyqws000ox67dwfg6yc6l	30주년 맞은 메탈슬러그, 리부트와 신작 공개	https://www.gamemeca.com/view.php?gid=1774222	2026-04-20 00:49:15	게임메카	기타	기타 기타	claude	메탈슬러그, 30주년 맞아 신작과 리부트 프로젝트 시작	SNK가 메탈슬러그 30주년을 맞아 신작 개발과 시리즈 리부트를 추진한다.	SNK는 메탈슬러그가 4월 19일 30주년을 맞이함에 따라 대규모 재출발 프로젝트를 공식 발표했다. 신작 게임 개발을 포함한 여러 기획을 추진하며, 이를 통해 오래된 프랜차이즈에 새로운 생명을 불어넣을 계획이다. 특설 사이트 개설과 공식 SNS 운영 개시로 팬들과의 소통 채널도 함께 마련했다.\n\n1996년 아케이드에 처음 출시된 메탈슬러그는 직관적인 조작감과 통쾌한 횡스크롤 액션, 섬세한 도트 그래픽으로 전 세계적 인기를 얻었다. 이후 속편과 스핀오프가 지속적으로 개발되었으며, 독특한 유머감각과 개성 있는 세계관으로 오랜 기간 팬층을 유지해왔다.\n\nSNK는 30주년 기념 영상을 공개하며 시리즈의 역사를 되짚고 향후 전개에 대한 기대감을 높였다. 앞으로 특설 사이트와 공식 SNS를 통해 30주년 기념 콘텐츠를 단계적으로 공개할 예정이다.	{메탈슬러그,SNK,신작게임}	PUBLISHED	2026-04-20 16:05:05.596	2026-04-20 16:05:05.596	0
cmo7dz1hy000qx67dk1b4cram	캐릭터 픽뚫 없다, 서브컬처 기대작 ‘이환’ 상세 정보 공개	https://www.gamemeca.com/view.php?gid=1774219	2026-04-19 07:54:28	게임메카	기타	기타 기타	claude	이환, 픽업 실패 없는 뽑기 시스템 도입	오픈월드 서브컬처 게임 이환이 캐릭터 픽뚫 없는 획득 시스템과 높은 자유도를 강조하며 29일 출시를 앞두고 상세 정보를 공개했다.	퍼펙트월드의 오픈월드 서브컬처 신작 '이환'이 게임의 뽑기 시스템 등 주요 콘텐츠를 상세히 공개했다. 18일 진행된 프리뷰 특별 방송에서 개발진은 캐릭터 획득 과정에서 유저 편의성을 높이는 데 중점을 두었음을 설명했다. 게임은 29일 모바일과 PC, PS5로 동시 출시될 예정이며, 27일부터 사전 다운로드가 시작된다.\n\n이환의 핵심 시스템은 '스카버러 마켓'이라는 독자적 캐릭터 획득 방식으로, 주사위를 굴려 보드 위에서 캐릭터를 얻는 감각을 구현했다. 한정 픽업의 경우 90회 시도 이내에 무조건 원하는 캐릭터를 획득 가능하며, 이 누적 횟수는 다음 픽업으로 이월된다. 상시 모집에서는 50회 도달 시 6종의 S급 캐릭터 중 원하는 것을 자유롭게 선택할 수 있어 유저 선택권을 보장한다.\n\n중복 획득으로 인한 강화 부담을 덜기 위해 1차 각성 시 순서와 무관하게 원하는 효과를 선택하고 교체할 수 있는 유연성을 제공했다. 이는 서브컬처 게임의 높은 자유도라는 개발 방향성과 맞물려 플레이어의 개성 있는 팀 구성을 가능하게 한다.	{이환,뽑기시스템,오픈월드}	PUBLISHED	2026-04-20 16:05:19.319	2026-04-21 11:08:55.486	1
cmo8q5wp0001011b5ow9zoce5	한화생命 e스포츠, 젠지 완파...3주 차 5승 1패로 선두 유지	lck-match-115548128962840611	2026-04-18 08:00:00	lolesports	Esports	LCK	fixed	한화생命 e스포츠, 젠지 완파...3주 차 5승 1패로 선두 유지	2026년 4월 18일 LCK 3주 차 경기에서 한화생命 e스포츠가 젠지를 2:0으로 셧아웃. 한화생命은 5승 1패 기록을 확보했다.	한화생命 e스포츠가 18일 오전 8시 진행된 LCK 3주 차 경기에서 젠지를 2:0으로 완파했다. 풀세트 접전 끝 승리를 거머쥔 한화생命은 현재 5승 1패를 기록 중이다.\n\n이번 승리로 한화생命은 리그 상위권 위치를 공고히 하며 연승 가도를 이어갔다. 반면 젠지는 3승 3패로 중위권에 머물렀으며, 상위권 진출을 위해서는 다음 경기부터 승수 확보가 긴급 과제가 됐다.\n\n한화生命은 다음 경기에서도 현 순위를 유지하기 위해 높은 집중력을 요구받을 것으로 보인다. 젠지는 이번 패배 후 리그의 변수 팀으로서 향후 경기 결과에 따라 순위 변동폭이 클 것으로 예상된다.	{LCK,"한화生命 e스포츠",젠지,"2:0 완파","3주 차",이스포츠}	PUBLISHED	2026-04-21 14:34:21.252	2026-04-21 14:34:21.252	0
cmo7dz6k2000rx67d8742b8po	신 캐릭터·창작마당 지원 &#039;슬레이 더 스파이어 2&#039; 로드맵 공개	https://www.gamemeca.com/view.php?gid=1774218	2026-04-19 07:54:15	게임메카	기타	기타 기타	claude	슬레이 더 스파이어 2, 신규 캐릭터와 스팀 창작마당 지원 예고	메가크릿이 슬레이 더 스파이어 2의 향후 개발 방향을 공개, 신캐릭터 추가와 플레이어 창작 지원 계획 발표	메가크릿은 지난달 앞서 해보기로 출시한 덱빌딩 로그라이크 게임 '슬레이 더 스파이어 2'의 개발 로드맵을 공개했다. 1.0 버전 완성을 목표로 신규 캐릭터, 새로운 카드와 유물, 2막과 3막 추가 콘텐츠 업데이트를 진행할 계획이다.\n\n기능 부문에서는 스팀 창작마당 지원으로 플레이어들의 창작 활동을 장려할 예정이며, 다국어 지원, 몬스터 도감, 실험적 게임 모드 등도 준비 중이다. 동시에 버그 수정, 성능 개선, 밸런싱 조정으로 전반적인 완성도를 높이는 작업도 병행하고 있다.\n\n개발진은 소규모 팀 체제를 유지하면서 건강한 속도로 작업하는 것을 우선시한다고 강조했다. 엄격한 마감일보다는 창의적인 아이디어를 구현할 수 있는 환경을 중시하며, 게임을 완성하기 위해 스튜디오 규모를 무리하게 확장할 계획은 없다고 밝혔다. 출시 이후 약 1억 4,500만 번의 게임 도전이 진행되었으며, 플레이어들의 선택 통계도 함께 공개되었다.	{"슬레이 더 스파이어 2",로드맵,"덱빌딩 로그라이크"}	PUBLISHED	2026-04-20 16:05:25.874	2026-04-20 16:05:25.874	0
cmo7dy7bc000lx67d5glqkogt	[롤짤] 2군 콜업으로 라인업 완성, KT 파죽지세 6연승	https://www.gamemeca.com/view.php?gid=1774227	2026-04-20 02:14:43	게임메카	PC	리그오브레전드	keyword	KT, 2군 서포터 에포트 콜업으로 라인업 완성하며 6연승	KT 롤스터가 2군 서포터 영입 이후 6연승을 기록하며 1라운드 전승 달성 가능성을 보이고 있다.	KT 롤스터가 2024 LCK 정규 시즌 1라운드에서 6연승을 이어가고 있다. 지난주 경기에서 디플러스 기이와 DN 수퍼스를 연이어 격파한 KT는 현재 6승 0패의 전적을 유지 중이며, 이대로라면 1라운드를 무패로 마무리할 수 있는 상황이다.\n\n이같은 성과의 배경에는 인선 보강이 자리잡고 있다. LCK 컵에서 주전 서포터 진영이 부진을 면치 못하자 KT는 2군에서 활약하던 에포트(이상호)를 1군으로 승격시켰다. 경기력을 회복한 원딜 에이밍과 정글의 호흡을 맞춘 에포트의 합류로 하단 라인의 안정성이 크게 향상됐다.\n\n기존 상체라인의 저력에 복구된 하단 라인까지 더해지면서 KT의 전력이 완성된 것이다. 정규 시즌 시작 전만 해도 조직력 측면에서 의문이 제기됐던 만큼, 현재의 연승은 인선 조정이 얼마나 중요한 변수인지를 보여주는 사례가 됐다.	{LCK,"KT 롤스터",에포트}	PUBLISHED	2026-04-20 16:04:40.2	2026-04-21 10:15:45.999	1
cmo7dyw1x000px67d9b2kihsw	포켓몬코리아, 서울 전역서 30주년 기념 행사 개최	https://www.gamemeca.com/view.php?gid=1774221	2026-04-20 00:39:53	게임메카	기타	기타 기타	claude	포켓몬코리아, 5월부터 서울 전역서 30주년 기념 대규모 축제 개최	포켓몬코리아가 30주년을 맞아 5월부터 6월까지 서울 곳곳에서 다양한 행사와 이벤트를 펼친다.	포켓몬코리아는 포켓몬 30주년 기념행사 '포켓몬 메가페스타 2026'을 5월부터 서울 전역에서 개최한다. 서울숲부터 성수동, 한강 뚝섬공원, 코엑스에 이르기까지 서울 주요 거점에서 약 두 달에 걸친 대규모 프로젝트를 진행하며, 팬들을 위한 전시, 참여형 이벤트, 한정판 상품 등을 제공한다.\n\n5월 1일부터 6월 21일까지 서울숲에서 열리는 '포켓몬 시크릿 포레스트'는 정원박람회와 연계해 포켓몬 테마의 경험 공간으로 조성된다. 성수동의 '메타몽 놀이터'는 보랏빛 메타몽을 중심으로 도시 속 특색 있는 분위기를 연출하며, 어린이날인 5월 5일 한강에서는 약 5,000명이 참가하는 '포켓몬 런 2026' 마라톤 행사가 펼쳐진다.\n\n5월 24일과 25일 삼성동 코엑스에서는 포켓몬 트레이딩 카드 게임과 포켓몬 게임의 국내 선수 선발전인 '포켓몬 스포츠데이 2026'이 개최되어 경쟁 게이밍 커뮤니티를 지원한다. 이 외에도 한 달간 포켓몬 고 서울 스탬프 랠리와 30주년 기념 전시, 팝업스토어 등 다양한 콘텐츠가 준비되어 있다.	{포켓몬,30주년,서울,행사,"메가페스타 2026"}	PUBLISHED	2026-04-20 16:05:12.262	2026-04-21 10:21:16.941	1
cmo7dxm50000hx67ditbjx34n	태국·인도네시아서 인기, 씰M 온 크로쓰 DAU 30만 명	https://www.gamemeca.com/view.php?gid=1774237	2026-04-20 05:12:40	게임메카	Mobile	기타 Mobile	claude	씰M 온 크로쓰, 출시 30일 만에 DAU 30만 명 돌파	플레이위드코리아의 MMORPG 씰M 온 크로쓰가 글로벌 출시 한 달 만에 누적 가입자 168만 명을 기록했다.	플레이위드코리아와 넥써쓰가 공동 퍼블리싱 중인 MMORPG '씰M 온 크로쓰'가 3월 출시 30일 만에 주요 성과를 달성했다. 최대 일일 활성 이용자(DAU)는 30만 명에 도달했으며, 누적 가입 계정 수는 168만 명, 생성된 캐릭터는 215만 개를 기록했다. 사전예약 단계에서 220만 명의 사용자가 참여했던 만큼 높은 관심도를 입증했다.\n\n지역별로는 태국(46%)과 인도네시아(37%)에서 가장 높은 유입률을 보였으며, 대만과 한국이 뒤를 이었다. 플랫폼 매출은 구글 플레이스토어(40%), 애플 앱스토어(33%), 크로쓰샵(27%)으로 분산되었다. 게임 내 활동도 활발해 한 달간 처치된 보스 몬스터는 약 3,500만 마리에 달했고, 장비 강화는 총 5,800만 건이 이루어졌다.\n\n플레이어 커뮤니티 측면에서도 길드 6,700개가 구성되었으며, 11,673쌍의 커플이 탄생했다. 클래스별 선택 비중은 사냥꾼(22%), 마법사(16%), 광대(15%) 순으로 나타났다. 플레이위드코리아는 앞으로 안정적인 운영과 지속적인 콘텐츠 업데이트를 통해 글로벌 유저 만족도를 높일 계획이다.	{"씰M 온 크로쓰",MMORPG,"글로벌 서비스",플레이위드코리아,모바일게임}	PUBLISHED	2026-04-20 16:04:12.756	2026-04-21 10:21:53.808	1
cmo9qrp6w000bt4szvlt13m1a	8 PS Plus Extra Game Removals for May 2026 Confirmed	https://www.pushsquare.com/news/2026/04/8-ps-plus-extra-game-removals-for-may-2026-confirmed	2026-04-21 12:00:00	Push Square	Console	PlayStation	fixed	PS Plus Extra 5월 8개 타이틀 서비스 종료 확정	PS Plus Extra 가입자들이 5월 19일부터 8개 게임을 이용할 수 없게 된다.	PlayStation Plus Extra 서비스에서 5월 19일 8개의 PS5 및 PS4 게임이 라인업에서 제외될 예정이다. PlayStation Plus 공식 멤버십 업데이트를 통해 다음 달 서비스 종료 타이틀 목록이 확정되었다.\n\n현재 PS Plus Extra 및 PS Plus Premium 구독자들은 4월의 신규 게임들을 이용 중이나, 5월 말 대규모 콘텐츠 이동이 예정돼 있다. 해당 타이틀들은 정해진 날짜 이후 구독 서비스를 통한 플레이가 불가능해진다.\n\nPlayStation은 매월 정기적으로 게임 라인업을 업데이트하고 있으며, 이는 사용자들이 신규 타이틀을 경험하면서도 주기적인 변화를 제공하는 전략의 일환이다. 서비스 종료 타이틀은 개별 구매를 통해 계속 플레이할 수 있다.	{"PlayStation Plus","PS Plus Extra","게임 라인업","서비스 종료"}	PUBLISHED	2026-04-22 07:39:04.136	2026-04-22 07:39:04.136	0
cmo7dwvie000bx67dfoh5yncm	아바타 10% 할인, 로블록스 구독 신상품 30일 출시한다	https://www.gamemeca.com/view.php?gid=1774246	2026-04-20 06:01:21	게임메카	Mobile	기타 Mobile	claude	로블록스, 월 4.99달러 구독 서비스 '플러스' 4월 30일 출시	로블록스가 신규 구독 상품을 출시해 할인과 비공개 서버 이용 등의 혜택을 제공한다.	로블록스는 4월 30일 월 4.99달러 가격의 신규 구독 상품 '로블록스 플러스'를 출시한다. 게임 아이템과 아바타 구매 시 10% 할인을 제공하며, 3개월 이상 구독 시 할인율이 20%로 상향된다.\n\n구독자는 추가 비용 없이 비공개 서버를 이용할 수 있어 함께 플레이할 사용자를 자유롭게 선택할 수 있다. 플랫폼 내에서 로벅스를 수수료 없이 송금할 수 있으며, 아바타 아이템을 거래하고 마켓플레이스에서 판매할 수도 있다. 이 외에도 구독자 전용 배지와 추가 기능을 순차적으로 제공할 예정이다.\n\n로블록스는 할인으로 인한 손실을 직접 부담해 콘텐츠 제작자의 수익을 보전한다. 새로운 API를 통해 사용자가 게임 내에서 직접 구독할 수 있도록 지원하며, 이를 통해 유입된 신규 구독자에 대해서는 최대 3개월간 추가 로벅스를 보상으로 지급한다.	{로블록스,구독서비스,게임플랫폼}	PUBLISHED	2026-04-20 16:03:38.246	2026-04-21 11:05:26.237	1
cmo7dwnlz0009x67ddja35u4i	금강선 참여, 스마게 신작 ‘프로젝트 오르페우스’ 채용 시작	https://www.gamemeca.com/view.php?gid=1774249	2026-04-20 07:25:06	게임메카	Mobile	기타 Mobile	claude	로스트아크 디렉터 금강선, 스마일게이트 신작 '프로젝트 오르페우스' 개발 시작	로스트아크 디렉터 금강선이 언리얼 엔진 5 기반 오픈월드 RPG 개발을 주도하며 대규모 인력 채용에 돌입했다.	로스트아크를 제작한 금강선 디렉터가 새로운 오픈월드 RPG 프로젝트를 이끌고 있다. 스마일게이트는 프로젝트 오르페우스(가칭)의 개발 시작을 공식화하고 20일부터 개발자 채용에 나섰다. 이 작품은 언리얼 엔진 5로 개발되며 PC와 콘솔 플랫폼을 목표로 하고 있다.\n\n금강선 디렉터는 채용 페이지에 공개한 편지에서 "자신이 좋아하던 게임을 만들고 싶다는 꿈을 추구하겠다"는 뜻을 밝혔다. 채용 분야는 기획, 게임개발, 그래픽, 사운드 부분에 걸쳐 전투 및 레벨 디자이너부터 3D 아트, 애니메이션, 음향 제작 인력까지 광범위한 포지션을 모집하고 있다.\n\n이 프로젝트는 업계 거장인 금강선 디렉터가 중심이 되어 추진되는 만큼 게이머들의 기대를 모으고 있다. 창의성과 게임성을 우선시하겠다는 개발진의 의지가 담긴 만큼, 향후 게임의 방향성이 주목되는 상황이다.\n\n채용은 5월 31일까지 스마일게이트 공식 채용 페이지를 통해 진행된다.	{스마일게이트,"프로젝트 오르페우스","금강선 디렉터","오픈월드 RPG","게임 개발"}	PUBLISHED	2026-04-20 16:03:28.008	2026-04-21 11:05:37.048	1
cmo7dw7q80006x67d6x9u6f1s	어린이대공원에 핑크빈이? 넥슨 &#039;단풍잎 놀이터 3호&#039; 개장	https://www.gamemeca.com/view.php?gid=1774255	2026-04-20 08:15:18	게임메카	Mobile	메이플스토리M	claude	넥슨, 서울어린이대공원에 메이플스토리 IP 활용한 놀이터 개장	넥슨이 메이플스토리의 핑크빈을 테마로 한 대규모 놀이터를 어린이대공원에 개장했다.	넥슨은 서울어린이대공원에 '단풍잎 놀이터 3호'를 개장했다. 750평 규모의 이 놀이터는 노후화된 공원 시설을 어린이들의 의견을 반영해 새롭게 조성한 공간으로, 메이플스토리 IP를 적극 활용했다.\n\n놀이터의 가장 눈에 띄는 시설은 9미터 높이의 '핑크빈 월드' 조합놀이대다. 이 외에도 미끄럼틀 5개, 그네 4개, 트램펄린 5개 등 다양한 연령대가 함께 즐길 수 있는 시설들이 갖춰졌다. 중앙의 '단풍잎 쉼터'는 보호자들을 위한 휴식 공간으로 마련됐다.\n\n설계 과정에는 어린이로 구성된 '단풍잎 용사단'이 직접 참여했으며, 참여 어린이들은 10점 만점에 9.1점으로 높은 만족도를 나타냈다. 이는 일반 생활권 놀이터 평균 대비 76포인트 높은 수치이며, 특히 1시간 이상 놀고 싶다는 응답이 기존 놀이터보다 3배 많았다.	{메이플스토리M,넥슨,어린이대공원}	PUBLISHED	2026-04-20 16:03:07.425	2026-04-21 11:05:37.963	1
cmo8plki3000011mr62tul1dw	몬길: 스타 다이브, 버튼 하나로 받아치는 ’호쾌함‘	https://www.gamemeca.com/view.php?gid=1774310	2026-04-21 09:51:03	게임메카	기타	기타 기타	claude	넷마블 '몬길: 스타 다이브', 5개 버튼으로 펼치는 박진한 액션	넷마블의 신작 액션 RPG가 간단한 조작으로 다양한 전투를 구현해 출시 초기 매출 순위권 진입	넷마블몬스터의 '몬길: 스타 다이브'가 4월 15일 출시 후 국내 애플 앱스토어 매출 2위, 구글플레이 5위에 올랐다. 전작 '몬스터길들이기'의 후속작이지만 수집 요소를 줄이고 액션에 초점을 맞춰 전혀 다른 게임으로 재구성했다. 캐릭터 3명으로 팀을 구성해 전술적으로 조합하며 플레이하는 방식이 핵심이다.\n\n게임은 5개 버튼으로 모든 전투를 해결하는 단순한 조작계를 채택했다. 마우스 좌클릭 일반공격, 우클릭 회피에 특수스킬, 교체스킬, 궁극기를 더했다. 전투는 3~5분의 시간제한 내에 최대 피해를 입히는 방식으로 진행되며, 이를 통해 긴장감 있는 전투 흐름을 유지하면서도 조작은 누구나 쉽게 따라갈 수 있도록 설계됐다.\n\n언리얼 엔진 5 기반의 그래픽도 주목할 점이다. 얼굴을 확대해도 디테일이 유지되는 캐릭터 표현과 극동 지역의 정교한 배경 묘사가 시각적 완성도를 높였다. 회차를 숏폼처럼 빠르게 진행하는 구성은 현대 게이머의 플레이 스타일과도 부합한다.	{액션RPG,넷마블,"몬길: 스타 다이브"}	PUBLISHED	2026-04-21 14:18:32.331	2026-04-21 14:18:32.331	0
cmo8plpgj000111mruoc1x55k	'태고의 달인' 코리아 챔피언십, 온라인 예선 참가 모집	https://www.gamemeca.com/view.php?gid=1774309	2026-04-21 08:58:24	게임메카	Esports	기타 Esports	claude	반다이남코, '태고의 달인' 코리아 챔피언십 콘솔 부문 온라인 예선 모집	닌텐도 스위치 기반 '태고의 달인' 한국 대회 예선 참가자 모집 중, 5월 5일 마감	반다이남코 엔터테인먼트 코리아가 '태고의 달인 코리아 챔피언십 2026 쿵딱전' 콘솔 부문 온라인 예선 참가 신청을 받고 있다. 이번 대회는 콘솔과 아케이드를 통합해 진행되는 세계 최초의 방식으로, 닌텐도 스위치용 '태고의 달인 쿵딱! 원더풀 페스티벌'을 통해 콘솔 예선이 열린다.\n\n참가자는 두 개의 과제곡을 플레이하고 영상을 제출해야 한다. 플레이 화면과 조작 장면을 동시에 담은 영상을 유튜브에 업로드한 후 신청 페이지에 링크를 첨부하면 된다. 태고 컨트롤러나 북채, 조이콘 사용이 가능하며, 합산 점수 상위 4명이 결선에 진출한다.\n\n5월 23일 서울 플레이엑스포에서 열리는 결선에는 콘솔 부문 4명과 아케이드 부문 8명이 참여해 토너먼트를 진행한다. 대한민국 국적의 거주자라면 누구나 참가할 수 있으며, 예선 진출자에게는 한정 명찰과 특별 제작 상패가 제공된다.\n\n온라인 예선 참가 신청 기간은 5월 5일 오후 11시 59분까지다.	{"태고의 달인",e스포츠,토너먼트}	PUBLISHED	2026-04-21 14:18:38.755	2026-04-21 14:18:38.755	0
cmo8plv3a000211mrt3i8z8mj	사이게임즈, 플레이엑스포에서 '그랑블루 신작' 시연한다	https://www.gamemeca.com/view.php?gid=1774308	2026-04-21 08:43:16	게임메카	기타	기타 기타	claude	사이게임즈, 플레이엑스포 2026에서 그랑블루 신작 첫 오프라인 시연	사이게임즈가 5월 21~24일 킨텍스서 열리는 플레이엑스포 2026에 참가해 7월 출시 예정인 '그랑블루 판타지 리링크 - 엔드리스 라그나로크'를 전 세계 최초로 오프라인 시연한다.	사이게임즈가 5월 21일부터 24일까지 일산 킨텍스에서 개최되는 플레이엑스포 2026에 참가해 그랑블루 판타지 시리즈의 최신작들을 선보인다. 특히 7월 9일 출시 예정인 '그랑블루 판타지 리링크 - 엔드리스 라그나로크'는 본 행사를 통해 세계 최초로 오프라인 플레이 기회를 제공할 예정이다.\n\n사이게임즈 부스에서는 신작과 함께 대전 격투게임 '그랑블루 판타지 버서스 라이징'도 출품된다. 관람객들은 두 게임 모두 직접 플레이할 수 있으며, 시리즈의 매력적인 캐릭터와 액션을 체험하거나 다른 방문객들과 대전을 즐길 수 있다. MSI의 협찬으로 고성능 모니터와 컴퓨터 장비를 갖춘 환경에서 게임을 즐길 수 있다는 점도 특징이다.\n\n사이게임즈는 게임 시연 외에도 현장 이벤트와 스테이지 프로그램을 준비해 관람객의 참여도를 높일 계획이다. 자세한 부스 운영 내용은 사이게임즈코리아 공식 SNS를 통해 추가로 공개될 예정이다.	{"그랑블루 판타지",플레이엑스포,신작}	PUBLISHED	2026-04-21 14:18:46.032	2026-04-21 14:18:46.032	0
cmo8pm02e000311mrf7lucvwh	고룡종 등장 증가, 몬스터 헌터 나우 봄 축제 2026 예고	https://www.gamemeca.com/view.php?gid=1774307	2026-04-21 08:31:05	게임메카	Console	몬스터헌터	claude	몬스터 헌터 나우, 봄 축제 2026 개최 고룡종 사냥 강화 이벤트 시작	나이언틱이 27일부터 5월 10일까지 고룡종 등장이 증가하는 봄 축제 이벤트 개최	나이언틱은 몬스터 헌터 나우에서 대규모 이벤트 '봄 축제 2026'을 27일부터 5월 10일까지 2주간 진행한다고 21일 발표했다. 축제 기간 동안 고룡종의 출현이 활발해지며, 신규 한정 무기와 장비가 추가된다.\n\n이번 축제의 핵심은 고룡종 사냥의 효율성을 대폭 향상시킨 점이다. 신규 라이트보우건 '로즈어썰트'는 마이너스 회심 발동 시 피해량이 증가하는 '흉회심' 스킬을 기본으로 장착해 방어구 세팅이 부족해도 높은 딜을 낼 수 있다. 모든 대연속 사냥이 24시간 '고룡영격전'으로 변환되며, 몬스터 접근 범위가 1.5배 확대되어 사냥이 한층 수월해진다. 보상으로는 희귀 아이템인 '반짝이는 알' 또는 '번쩍이는 알'이 확정 지급된다.\n\n새로운 강화 요소 '수수께끼의 표류석[P]'은 방어구에 '파괴왕'과 '특수 스킬 위력 UP' 등의 기술을 부여할 수 있게 해준다. 축제 기간에는 표류석 연성에 필요한 이동 거리가 1킬로미터로 단축되어 평상시보다 빠르게 장비를 갖출 수 있다. 교환소에서는 한정 의상과 길드 카드 배경, 장비 강화 티켓 등 다양한 보상을 획득할 수 있다.	{몬스터헌터나우,이벤트,고룡종}	PUBLISHED	2026-04-21 14:18:52.503	2026-04-21 14:18:52.503	0
cmo8pm64u000411mrj5hw2zi8	출시 이틀 만에, 캡콤 ‘프래그마타’ 판매 100만 장 달성	https://www.gamemeca.com/view.php?gid=1774305	2026-04-21 08:18:22	게임메카	Console	기타 Console	claude	캡콤 신작 '프래그마타', 출시 이틀 만에 전 세계 100만 장 판매 돌파	퍼즐과 액션을 결합한 캡콤의 신규 IP '프래그마타'가 출시 후 48시간 내 100만 장 판매를 기록했다.	캡콤의 신작 '프래그마타'가 지난 20일 출시 이틀 만에 전 세계 누적 판매량 100만 장을 달성했다. 퍼즐과 슈팅을 결합한 SF 액션게임으로, 근미래 달 기지를 배경으로 파견 대원 휴와 안드로이드 소녀 다이애나의 모험을 다룬다. 캡콤은 공식 SNS를 통해 게이머들의 지지에 감사를 표하며 특별 일러스트를 공개했다.\n\n게임은 비평과 사용자 평가 모두에서 높은 점수를 기록했다. 메타크리틱 평론가 점수 86점을 기록했으며, 스팀에서도 717개 리뷰 중 97%가 긍정 평가를 남겼다. 특히 캡콤 타이틀 중 이례적으로 한국어 음성 더빙을 포함하는 등 현지화에 신경 써 글로벌 게이머들의 호응을 얻었다.\n\n완전한 신규 IP로서 제로부터 세계관을 구축한 이 작품은 캡콤의 새로운 도전을 의미한다. 개발팀은 성공에 대해 "전 세계 게이머들의 플레이가 있었기에 가능했다"며, 앞으로도 더 많은 이들에게 게임의 매력을 전하기 위해 노력하겠다고 밝혔다.	{캡콤,프래그마타,신작,판매,"100만 장"}	PUBLISHED	2026-04-21 14:19:00.367	2026-04-21 14:19:00.367	0
cmo8pmavj000511mrzz0ke2f7	LCK 6연승 거둔 KT 롤스터, 팀 최고 기록 경신 노린다	https://www.gamemeca.com/view.php?gid=1774304	2026-04-21 08:02:58	게임메카	PC	리그오브레전드	keyword	KT 롤스터, 6연승으로 팀 최장 연승 기록 경신 도전	KT 롤스터가 LCK 4주 차에서 팀 최고 기록인 6연승을 넘어설 준비를 마쳤다.	KT 롤스터가 LCK 정규 시즌 개막 이후 6연승을 이루며 팀 최장 연승 기록 경신에 나선다. 22일부터 26일까지 진행되는 4주 차에서 단독 1위 팀은 키움 DRX, BNK 피어엑스와의 경기를 통해 약 9년 전인 2017년 스프링 시즌에 세운 6연승 기록을 깰 기회를 갖는다. KT 롤스터의 무패 행진은 팀 전체 라이너들의 기량 향상에서 비롯됐다. 미드 라이너 비디디, 탑 라이너 퍼펙트, 서포터 에포트를 비롯한 핵심 선수들이 T1, 젠지, 농심 레드포스, 디플러스 기아 등 강팀들을 연속으로 격파했다. 다만 2017년 당시 7위였던 MVP에게 패배하며 연승을 멈춘 전례가 있어 이번 경기의 결과는 예측 불가능성을 내포하고 있다.\n\n3주 차 4승 2패로 단독 3위인 농심 레드포스도 4주 차를 상위권 유지의 분수령으로 보고 있다. 한화생명e스포츠와 젠지를 연달아 상대하게 되는 농심 레드포스는 두 팀 모두와 순위 경쟁을 벌이고 있어 이번 일정의 중요도가 높다. 한화생명e스포츠는 5승 1패로 선행하고 있으며, 젠지는 3승 3패로 뒤를 좇고 있어 각 경기마다 순위 변동이 예상된다.	{LCK,"KT 롤스터","연승 기록"}	PUBLISHED	2026-04-21 14:19:06.511	2026-04-21 14:19:06.511	0
cmpcirb0z001aaa8ax4y8bavr	PS5 Fans Vote Jak & Daxter As Their Most Wanted PlayStation Revival	https://www.pushsquare.com/news/2026/05/ps5-fans-vote-jak-and-daxter-as-their-most-wanted-playstation-revival	2026-05-18 18:00:00	Push Square	Console	PlayStation	fixed	PlayStation 팬들의 선택, '잭 & 댁스터' 역대급 부활 염원... 나티독 프랜차이즈 재개발 가능성 재부상	PlayStation 커뮤니티 투표에서 '잭 & 댁스터' 시리즈가 가장 부활을 원하는 소니 IP로 선정되며, 나티독의 차기작 개발 로드맵에 포함될 가능성이 대두됐다.	PlayStation 팬들 사이에서 '잭 & 댁스터' 시리즈의 부활을 염원하는 목소리가 압도적으로 높다는 투표 결과가 나왔다. 소니 1st 파티 개발사 나티독의 대표 IP 중 하나인 이 프랜차이즈는 PS2 시대를 대표하는 3D 플랫포머로, 20년이 넘은 지금까지도 국내를 포함한 글로벌 게이머들 사이에서 강력한 향수와 부활 열망을 유지하고 있다.\n\nPS2 시절 '더 프리커서 레거시'로 강렬한 첫인상을 남긴 '잭 & 댁스터'는 당시 소니의 대표작으로, 일관된 샌드박스 월드와 직관적인 게임플레이로 정평받아 있다. 현재 PlayStation 커뮤니티에서 실시된 IP 부활 투표에서 '잭 & 댁스터'가 '갓 오브 워'나 '언차티드' 같은 메가 프랜차이즈를 제치고 최다득표를 기록한 것은, 팬들이 얼마나 강하게 이 시리즈의 현대적 재해석을 갈망하고 있는지를 여실히 보여준다.\n\n이 같은 결과는 소니가 향후 IP 포트폴리오 전략을 수립할 때 중요한 지표로 작용할 것으로 예상된다. 특히 나티독은 현재 '더 라스트 오브 어스 파트 2'의 멀티플레이 스핀오프 프로젝트 취소 이후 새로운 IP 개발에 주력하고 있는 상황. PlayStation Studios가 보유한 레거시 프랜차이즈 중 팬 투표로 가장 높은 선호도를 기록했다는 점은, 적어도 개발진의 관심사나 차기 프로젝트 기획 단계에서 참고할 만한 값진 데이터가 될 수 있다는 의미다.\n\n현재 '잭 & 댁스터' 신작에 대한 공식 발표는 없으며, 나티독 측도 구체적인 개발 계획을 밝히지 않았다. 다만 PlayStation Blog나 State of Play를 통한 향후 공식 발표를 주시할 필요가 있다. 국내 PS5 유저라면, 이 투표 결과가 향후 소니의 독점작 로드맵에 어떤 영향을 미칠지 지속적으로 모니터링하기를 권장한다.	{"PlayStation 5","잭 & 댁스터",나티독,"프랜차이즈 부활"}	PUBLISHED	2026-05-19 10:57:49.715	2026-05-19 10:57:49.715	0
cmo8pmfj6000611mrqog0moqg	창세기전 모바일에 투신전생기 '알테어'가 왔다	https://www.gamemeca.com/view.php?gid=1774303	2026-04-21 07:55:39	게임메카	Mobile	기타 Mobile	claude	창세기전 모바일, 투신전생기 컬래버 2차 업데이트 진행	라인게임즈의 모바일 SRPG '창세기전 모바일'이 네이버웹툰 '투신전생기'와의 협력으로 신규 캐릭터 알테어를 추가했다.	라인게임즈는 서비스 중인 모바일 SRPG '창세기전 모바일'에 네이버웹툰 '투신전생기' 컬래버레이션 2차 업데이트를 21일 실시했다. 신규 캐릭터 알테어를 포함한 이번 업데이트는 5월 6일까지 진행될 예정이다.\n\n알테어는 유리디카의 혈통을 이어받은 마도사로, 전투에서 초필살기 '죄의 가시'를 발동하여 상대방에게 피해를 입히고 이동을 제한한다. 함께 추가된 전용 무기 '빅토리아의 영광'은 알테어, 유스티나, 카이엔이 장착할 때 최대 성능을 발휘한다. 신규 스토리 챕터 '파멸의 암흑신'에서는 시라노 일행과 제피르팰컨의 연합이 파멸의 위협에 맞서는 내용을 전개한다.\n\n이벤트 참여를 통해 투신 제피르 성장 자료와 전설 등급 장비, 기억의 파편 등 다양한 보상을 획득할 수 있다. 클라우제비츠 캐릭터의 능력치 상향과 고난도 스토리 확장도 함께 이루어졌다.	{"창세기전 모바일",모바일게임,컬래버레이션}	PUBLISHED	2026-04-21 14:19:12.546	2026-04-21 14:19:12.546	0
cmo8pmpyj000811mraxep5plt	넥슨, '빈딕투스: 디파잉 페이트' 패키지 아닌 부분유료로	https://www.gamemeca.com/view.php?gid=1774297	2026-04-21 07:28:37	게임메카	기타	기타 기타	claude	넥슨 '빈딕투스: 디파잉 페이트', 부분유료화 기반으로 확정	넥슨의 마비노기 영웅전 기반 액션 RPG '빈딕투스'가 부분유료화로 서비스될 예정이다.	넥슨이 개발 중인 액션 RPG '빈딕투스: 디파잉 페이트'는 부분유료화 모델로 운영될 예정이다. 개발팀은 가능한 많은 플레이어가 진입장벽 없이 게임을 즐길 수 있도록 하기 위해 이같은 결정을 내렸으며, 수익은 외형 코스튬을 중심으로 창출할 계획이다.\n\n게임은 마비노기 영웅전의 주요 캐릭터와 설정을 기반으로 하면서도 오리지널 요소를 가미할 방침이다. 스토리는 한 번에 공개되지 않고 정기적인 업데이트를 통해 순차적으로 풀릴 예정이며, 캐릭터 추가도 원작의 모든 인물을 이식하지는 않을 것으로 밝혀졌다. 플레이어 간 거래나 거래소 시스템도 게임의 방향성에 맞지 않아 도입하지 않는다.\n\n빈딕투스는 소울라이크 장르가 아니며, 무겁고 느린 액션보다는 빠르고 경쾌한 플레이를 추구한다. 레벨링은 '저니 레벨' 방식으로 계정 내 모든 캐릭터에 동일한 레벨이 적용되며, 장비와 강화 시스템도 원작과는 완전히 다르게 설계됐다.\n\n빈딕투스는 2027년 출시 예정이다.	{넥슨,빈딕투스,부분유료화,액션RPG,마비노기}	PUBLISHED	2026-04-21 14:19:26.059	2026-04-21 14:19:26.059	0
cmo8pmvqu000911mreclz2j5t	인간과 귀신이 공존하는 세계, '넋나간 삼국지' 사전예약	https://www.gamemeca.com/view.php?gid=1774293	2026-04-21 07:15:18	게임메카	Mobile	기타 Mobile	claude	바이트펀게임즈, 귀신 콘셉트 방치형 RPG '넋나간 삼국지' 사전예약 시작	삼국지와 귀신을 결합한 방치형 RPG '넋나간 삼국지'가 21일부터 사전예약을 시작했다.	바이트펀게임즈는 방치형 RPG '넋나간 삼국지'의 사전예약을 21일부터 진행한다. 이 게임은 삼국지 세계관에 인간과 귀신이 공존하는 독특한 설정을 더했으며, 플레이어가 주공이 되어 귀신으로 되살아난 삼국 영웅들을 수집하고 육성하는 방식으로 진행된다.\n\n게임은 자동 전투 중심의 방치형 시스템으로 운영되며, 플레이어는 다양한 무장 조합을 통해 전략적인 플레이를 펼칠 수 있다. 각 캐릭터는 귀신 콘셉트에 맞춘 개성 있는 스킬과 연출로 차별화된 재미를 제공한다.\n\n사전예약 참여자는 한국 전용 S+ 등급 캐릭터 유비를 비롯한 게임 내 보상을 받으며, 누적 인원이 증가할수록 게임 재화, 고급 소환권, 스타벅스 기프트카드 등 추가 보상이 순차적으로 제공된다. 삼성 갤럭시 Z 플립7, PS5 프로, 구글 픽셀 10 등을 경품으로 하는 추첨 이벤트도 진행되며, 공식 네이버 라운지에서는 사전예약 인증 이벤트를 통해 추가 참여 기회를 제공한다.	{방치형RPG,넋나간삼국지,모바일게임}	PUBLISHED	2026-04-21 14:19:33.558	2026-04-21 14:19:33.558	0
cmo8q29dg000811b5qrrpvgu1	BNK 피어엑스, 디플러스 기아 완파…플레이오프 첫 관문 통과	lck-match-115604876650946529	2026-02-28 08:00:00	lolesports	Esports	LCK	fixed	BNK 피어엑스, 디플러스 기아 완파…플레이오프 첫 관문 통과	2026년 2월 28일 LCK 플레이오프에서 BNK 피어엑스가 디플러스 기아를 3:0으로 셧아웃, 동점 상황에서의 결승전 진출권을 확보했다.	BNK 피어엑스가 28일 오전 LCK 플레이오프 무대에서 디플러스 기아와의 BO5 경기를 3:0으로 완파했다. 두 팀 모두 정규시즌 3승 2패로 동일한 전적을 기록했으나, 이번 경기에서 BNK 피어엑스가 결정적 우위를 점했다.\n\n각 세트가 치열한 접전으로 진행되었음에도 불구하고 BNK 피어엑스가 3세트 모두를 제압하며 플레이오프 첫 관문을 통과했다. 이는 정규시즌 성적이 같았던 두 팀 간의 경기에서 상승세를 탄 팀의 저력을 여실히 보여주는 결과로 평가된다.\n\n이번 승리로 BNK 피어엑스는 플레이오프 다음 라운드 진출이 확정되었으며, 디플러스 기아는 추가 경기를 통한 탈락팀 구제 무대로 내려가게 된다. LCK 플레이오프의 변수는 계속해서 흐름의 주도권을 누가 쥐는가에 달려있음을 다시금 증명했다.	{LCK,"BNK 피어엑스","디플러스 기아",플레이오프,3:0,완파}	PUBLISHED	2026-04-21 14:31:31.061	2026-04-21 14:31:31.061	0
cmo8pn21u000a11mrfve6mabd	ECA 독점 중계까지, 게이머가 디즈니+ 주목해야 하는 이유	https://www.gamemeca.com/view.php?gid=1774133	2026-04-21 06:05:00	게임메카	Esports	기타 Esports	claude	디즈니+, 2026 아시아 이스포츠 대회 독점 중계로 글로벌 e스포츠 플랫폼 위상 강화	디즈니+가 24일부터 아시아 이스포츠 대회를 독점 중계하며 e스포츠 콘텐츠 확보에 본격 나섰다.	디즈니+가 한국을 포함한 7개 아시아 국가가 참가하는 '2026 아시아 이스포츠 대회'를 24일부터 독점 생중계한다. 지난해 KeSPA컵 리그 오브 레전드 경기를 성공적으로 중계한 디즈니+는 올해도 인터뷰와 특별 영상 같은 오리지널 콘텐츠를 곁들일 계획이다. 글로벌 OTT의 강점을 활용해 국내 e스포츠를 세계 무대로 끌어올리는 전략을 이어가는 것이다.\n\n2026 아시아 이스포츠 대회는 2021년 한중일 대회에서 출발해 올해 처음 아시아 전역으로 확대되는 규모 있는 행사다. 참가국은 한국, 중국, 일본, 베트남, 태국, 필리핀, 몽골 등 7개국이며, 경기 종목은 시범 종목을 포함해 역대 최다인 7개다. 지난해 대한민국이 리그 오브 레전드와 스테핑 종목을 우승한 만큼 이번 대회에서도 한국의 선전이 기대된다.\n\nOTT 시장이 포화되면서 플랫폼들은 차별화 전략에 집중하고 있다. 디즈니+는 기존의 엔터테인먼트 콘텐츠에서 벗어나 e스포츠 중계라는 새로운 영역을 개척함으로써 게이머 층 확보에 나섰다. 이는 국내 e스포츠가 단순 국내 소비용을 넘어 글로벌 콘텐츠로 발돋움하는 계기가 될 것으로 평가된다.	{디즈니+,"아시아 이스포츠 대회","e스포츠 중계"}	PUBLISHED	2026-04-21 14:19:41.73	2026-04-21 14:19:41.73	0
cmo8pn7f8000b11mrw6afsypb	웹젠, ‘드래곤소드’ 스팀 서비스 금지 가처분 신청	https://www.gamemeca.com/view.php?gid=1774295	2026-04-21 06:00:22	게임메카	PC	기타 PC	claude	웹젠, 드래곤소드 스팀 자체 퍼블리싱 금지 가처분 신청	웹젠이 개발사 하운드13의 드래곤소드 스팀 출시를 막기 위해 법적 조치에 나섰다.	웹젠과 개발사 하운드13 간 '드래곤소드' 퍼블리싱 권한 분쟁이 법정으로 확대됐다. 웹젠은 21일 하운드13이 추진 중인 스팀 플랫폼 자체 퍼블리싱을 금지하는 가처분을 신청했으며, 동시에 자신의 퍼블리싱 권한 효력을 확인하는 소송도 진행 중이라고 밝혔다.\n\n분쟁의 시작은 2월 웹젠의 미니멈 개런티 잔금 미지급으로 거슬러 올라간다. 하운드13은 계약 해지를 통보했으나 웹젠은 3월 잔금 지급 후 계약이 유효하다고 주장했다. 4월 초 양사가 협의 중단을 선언하자 하운드13은 스팀 독립 출시 계획을 공식화했고, 웹젠은 이에 대응하는 형태로 가처분 신청에 이르게 됐다.\n\n웹젠은 성명에서 적법한 퍼블리싱 권한 없는 스팀 서비스가 게임 이용자 보호와 피해 구제에 혼선을 초래할 수 있다고 우려했다. 아울러 법적 절차를 통해 분쟁을 정리하고 안정적인 서비스 환경을 확보하겠다는 입장을 재확인했다.	{웹젠,드래곤소드,법적분쟁,스팀}	PUBLISHED	2026-04-21 14:19:48.693	2026-04-21 14:19:48.693	0
cmo8pnc1q000c11mry2t39gmd	이재명 대통령 인도 순방에 크래프톤 합류, 1조 펀드 조성한다	https://www.gamemeca.com/view.php?gid=1774294	2026-04-21 05:51:45	게임메카	기타	기타 기타	claude	크래프톤, 네이버·미래에셋과 인도 투자펀드 1조 원 규모 조성	크래프톤이 네이버, 미래에셋과 함께 인도 시장 진출 지원을 위해 최대 1조 원 규모의 유니콘 그로스 펀드를 조성했다.	크래프톤은 21일 네이버, 미래에셋과 함께 인도 뉴델리에서 최대 1조 원 규모의 '유니콘 그로스 펀드(UGF)' 조성 기념 간담회를 개최했다. 이 펀드는 인도 유망 기업들의 글로벌 시장 진출을 돕는 투자 기구로, 크래프톤이 2,000억 원을 주도적으로 출자해 구성됐다.\n\n유니콘 그로스 펀드는 올해 초 결성을 완료했으며 최근 본격적인 운용에 들어갔다. 크래프톤은 인도 게임 생태계 구축 경험을 바탕으로 현지 스타트업의 글로벌 확장을 중장기적으로 지원할 계획이다. 네이버는 인도의 AI·핀테크·콘텐츠 등 고성장 기술 기업에 투자해 전략적 시너지를 창출하는 것을 목표로 삼고 있다.\n\n이번 행사는 이재명 대통령의 인도 순방을 계기로 열렸으며, 한국 정부 대표로 김정관 산업통상부 장관이 참석했다. 크래프톤 측은 인도를 세계에서 가장 빠르게 확장되는 게임 시장이자 콘텐츠와 기술 혁신의 중심지로 평가하며, 인도 현지 기업 및 벤처캐피탈을 대상으로 펀드 운용 방향을 소개했다.	{크래프톤,투자펀드,"인도 시장"}	PUBLISHED	2026-04-21 14:19:54.687	2026-04-21 14:19:54.687	0
cmo8pnh51000d11mr8loxrth7	뱀파이어 서바이버를 턴제 1인칭으로, 뱀파이어 크롤러	https://www.gamemeca.com/view.php?gid=1774292	2026-04-21 05:16:48	게임메카	PC	리그오브레전드	keyword	뱀파이어 크롤러, 뱀파이어 서바이버 세계관을 턴제 1인칭 던전 크롤러로 재해석	뱀파이어 서바이버의 세계관을 바탕으로 턴제 덱빌딩과 로그라이트를 결합한 던전 탐험 RPG이 4월 22일 출시된다.	뱀파이어 서바이버의 세계관을 확장한 신작 '뱀파이어 크롤러'가 4월 22일 정식 출시된다. 이 게임은 원작의 전투적 쾌감을 유지하면서 턴제 덱빌딩과 로그라이트 요소를 접목한 던전 탐험 RPG다. 특히 탑뷰 시점에서 1인칙 관점으로 변경되면서 완전히 다른 게임성을 제시한다.\n\n뱀파이어 크롤러는 '터보 턴'이라는 독자적인 시스템을 도입해 턴제의 느린 속도감을 탈피했다. 플레이어는 신중한 전략 수립부터 빠른 속도의 턴 진행까지 자신의 성향에 맞게 선택할 수 있으며, 게임 결과는 조작 속도와 관계없이 동일하게 계산된다. 던전 탐색 중 만나는 적을 처치하고 캐릭터를 강화하는 과정에 강한 무작위 요소가 반영되어, 같은 구조의 던전이라도 매번 새로운 접근이 필요하다.\n\n게임의 핵심은 보물 발굴과 최적의 카드 조합 구성이다. 로그라이트의 무작위 보상 시스템 속에서 상식을 초월한 강력한 카드 조합을 발견하는 재미가 뱀파이어 서바이버의 눈덩이 같은 성장 구조를 계승한다. 이는 원작의 매력을 유지하면서 전혀 다른 장르의 경험을 제공한다.	{"뱀파이어 크롤러","던전 탐험 RPG","턴제 덱빌딩",로그라이트}	PUBLISHED	2026-04-21 14:20:01.285	2026-04-21 14:20:01.285	0
cmpciriej001baa8anhqsk2ie	'Pretty Awesome, Huh?': Even the Father of Final Fantasy Can't Avoid AI Drama	https://www.pushsquare.com/news/2026/05/pretty-awesome-huh-even-the-father-of-final-fantasy-cant-avoid-ai-drama	2026-05-18 17:30:00	Push Square	Console	PlayStation	fixed	PlayStation 역사의 아버지 사카구치 히로노부, AI 논란에 휘말리다... 'FF6 리메이크' 추측 급증	파이널 판타지 시리즈의 창시자 사카구치 히로노부가 AI 생성 영상에 반응하며 소셜 미디어 논란에 휘말렸으며, 이는 일본 팬덤 사이에서 FF6 리메이크 가능성에 대한 추측을 촉발했다.	파이널 판타지 프랜차이즈의 아버지로 불리는 전설의 게임 개발자 사카구치 히로노부가 X(구 트위터)에서 AI 생성 영상에 반응하면서 인공지능 윤리 논란의 중심에 서게 됐다. 해당 영상은 'FF6 리메이크'의 가상 콘셉트를 시각화한 것으로, 일본 팬덤 사이에서 빠르게 확산되며 공식 개발 가능성에 대한 추측을 부채질했다.\n\n사카구치의 반응은 단순한 호평이 아닌 것으로 해석되면서, 게임 업계 내 AI 활용의 경계선을 둘러싼 기존 논쟁을 재점화시켰다. 특히 스퀘어 에닉스가 최근 AI 도입 계획을 공개한 상황에서 이 같은 발언은 팬들 사이에서 '공식 입장 암시'로 받아들여지는 경향이 있다. 일부 커뮤니티에서는 FF6 리메이크가 PlayStation 플랫폼을 중심으로 차세대 프로젝트로 추진될 가능성을 논의 중이다.\n\nFF7 리메이크 시리즈의 성공 이후, 스퀤어 에닉스는 클래식 타이틀의 모던 재해석에 공을 들여왔으며, FF6는 시리즈 역사상 가장 인기 높은 에피소드 중 하나로 평가받고 있다. 다만 개발사 측은 아직 공식 발표를 하지 않은 상태이며, 사카구치의 발언이 단순한 기술 평가인지 프로젝트 암시인지는 현재로서 불명확하다.\n\n**국내 발매 정보**: 현재 FF6 리메이크 공식 발표가 이루어지지 않아 한국어 지원 여부, 정가, 출시 일정 등의 정보는 미정 상태입니다. 소문이나 추측이 아닌 스퀘어 에닉스의 공식 발표를 대기 중이며, PlayStation Korea 공식 채널과 스퀘어 에닉스 코리아를 통해 향후 소식을 확인할 수 있습니다.	{PlayStation,"Final Fantasy 6","Square Enix","AI 논란"}	PUBLISHED	2026-05-19 10:57:59.274	2026-05-19 10:57:59.274	0
cmo8pnm9w000e11mrdg8gwx4n	1주년 맞은 SD 건담 지제네 이터널, 글로벌 매출 '껑충'	https://www.gamemeca.com/view.php?gid=1774290	2026-04-21 03:51:15	게임메카	기타	기타 기타	claude	SD 건담 지제네 이터널, 1주년 맞아 아시아 매출 급등	SD 건담 지제네 이터널이 1주년 기념 업데이트로 일본, 대만, 한국 등 아시아 주요 시장에서 매출 상위권 진입.	SD 건담 지제네 이터널이 1주년을 맞아 아시아 앱마켓에서 매출 순위를 크게 끌어올렸다. 4월 1일 시작된 1주년 기념 업데이트 직후 일본 애플 앱스토어 매출 1위를 달성했으며, 대만과 한국에서도 상위권에 진입했다.\n\n이번 업데이트는 신기동전기 건담W 엔드리스 왈츠와 기동전사 건담 00의 신규 메인 스테이지 추가와 함께 윙 건담 제로(EW판)와 더블오 라이저(최종결전사양) 등 주역급 기체와 캐릭터를 포함한 신규 유닛을 선보였다. 4월 2일에는 일본과 대만에서 각각 1위를 기록했고, 국내에서도 애플 앱스토어 10위에 올랐다.\n\n반다이남코 엔터테인먼트는 웹 스토어에서 다이아 증정과 한정 패키지 판매를 통해 자체 채널 유도에 집중한 가운데도 앱마켓 성과를 거뒀다. 4월 16일 후속 업데이트 이후에도 매출 순위 상승세가 이어져 4월 17일 일본 애플 앱스토어 매출 1위를 재차 기록하는 등 지속적인 인기를 유지했다.	{SD건담지제네이터널,1주년,매출순위}	PUBLISHED	2026-04-21 14:20:07.94	2026-04-21 14:20:07.94	0
cmo8pnruj000f11mrhf8i6pdy	탄막 슈팅 '식혼도: 블루 피에타' 영상 공개, 5월 18일 출시	https://www.gamemeca.com/view.php?gid=1774282	2026-04-21 03:43:41	게임메카	기타	기타 기타	claude	탄막 슈팅 '식혼도: 블루 피에타' 5월 18일 스팀·스토브 출시	디어팜 개발 탄막 슈팅 신작, 횡스크롤 방식으로 변경하고 대도시 배경 채택	CFK는 디어팜이 개발하는 탄막 슈팅 게임 '식혼도: 블루 피에타'를 5월 18일 스팀과 스토브를 통해 글로벌 출시한다. 전작 '식혼도: 백화요란'의 인기에 이어 선보이는 후속작으로, 시리즈 최초로 횡스크롤 방식을 도입하고 현대적 도시 배경에서 펼쳐지는 새로운 이야기를 담았다.\n\n게임은 수습 저승사자 채우리와 뱀파이어 헌터 레일라라는 두 주인공의 만남에서 시작한다. 대도시, 놀이공원, 지하철역, 대저택 등 현대적 공간을 배경으로 이국의 설화에 등장하는 강적들과 대면하게 된다. 공식 영상에는 횡스크롤로 쏟아지는 탄막 속 정밀한 움직임과 게임의 핵심 전투 시스템들이 담겼다.\n\n전작에서 호평받은 소울 콜렉트 시스템이 강화되었으며, 신규 카운터 봄 시스템이 추가되었다. 소울 콜렉트는 적탄에 가까이 붙으면 게이지가 충전되고, 발동 시 탄막을 점수 아이템으로 전환하여 획득 점수를 배수 증가시킨다. 카운터 봄은 피격 직전 8프레임 안에 폭탄 버튼을 입력하면 피해 없이 추가 보상을 얻는 고난도 시스템으로, 숙련된 플레이를 장려한다.	{탄막슈팅,식혼도,인디게임,5월출시}	PUBLISHED	2026-04-21 14:20:15.164	2026-04-21 14:20:15.164	0
cmo8pnwba000g11mrz1aw4cuk	아빠는? 비주얼 노벨 '앤드 로저' 모바일, 스위치 2 예고	https://www.gamemeca.com/view.php?gid=1774288	2026-04-21 03:31:02	게임메카	기타	기타 기타	claude	감동 인터랙티브 노벨 '앤드 로저', 모바일과 스위치 2로 출시 확대	코단샤의 화제작 '앤드 로저'가 iOS, 안드로이드, 닌텐도 스위치 2 버전을 출시하며 29개 언어 지원	코단샤가 인터랙티브 노벨 게임 '앤드 로저'의 모바일과 닌텐도 스위치 2 버전 출시를 발표했다. 오는 26월 18일 공개될 예정인 이번 이식 버전은 iOS, 안드로이드, 스위치 2를 지원하며 총 29개 언어로 서비스될 예정이다.\n\n게임은 어린 소녀의 시점에서 집에 낯선 남자가 자고 있는 기묘한 상황을 풀어나가는 인터랙티브 노벨이다. 스팀에서 95% 긍정 평가를 받으며 '1시간 만에 울 수 있는 게임'이라는 입소문을 탔고, 2025년 7월 출시 이후 10만 장을 돌파했다.\n\n게임의 높은 평가는 국제적으로도 인정받아 지난 3월 디벨로퍼스 초이스 어워드에서 오디언스 어워드를 수상했다. 플랫폼 확대를 통해 더 많은 게이머들이 이 작품에 접근할 수 있게 될 것으로 기대된다.	{비주얼노벨,인터랙티브게임,모바일게임,스위치2,코단샤}	PUBLISHED	2026-04-21 14:20:20.95	2026-04-21 14:20:20.95	0
cmo8po0w5000h11mr6vb0btmb	엘든 링 실사 영화, 2028년 3월 개봉 목표로 촬영 들어간다	https://www.gamemeca.com/view.php?gid=1774287	2026-04-21 03:09:57	게임메카	Console	기타 Console	claude	알렉스 가랜드 감독의 엘든 링 실사 영화, 2028년 3월 개봉 확정	반다이남코와 A24가 엘든 링 실사 영화 개봉일을 공식 발표. 2028년 3월 3일 아이맥스 상영 목표.	반다이남코 엔터테인먼트와 제작사 A24가 엘든 링 실사 영화의 개봉일을 공식 확정했다. 영화는 2028년 3월 3일 아이맥스 형식으로 개봉될 예정이며, 올 봄부터 촬영을 시작해 약 100일간 제작 공정을 진행한다.\n\n영화는 A24 역사상 최대 규모인 1억 달러가 넘는 제작비가 투입되는 프로젝트다. 감독은 영화 엑스 마키나와 시빌 워를 연출한 알렉스 가랜드가 맡으며, 그는 원작 게임의 오랜 팬으로서 직접 이 프로젝트를 제안한 것으로 알려졌다. 출연진에는 킷 코너, 벤 위쇼를 비롯해 케일리 스패니, 톰 버크, 조나단 프라이스, 닉 오퍼맨, 소노야 미즈노 등 실력 있는 배우들이 대거 참여한다.\n\n원작 게임의 정체성을 보장하기 위해 게임의 세계관을 설계한 조지 R.R. 마틴도 제작자로 참여한다. 엘든 링은 2022년 출시 이후 3,000만 장 이상의 판매고를 기록했으며, 400개 이상의 올해의 게임상을 수상하며 평단과 대중으로부터 동시에 극찬을 받은 바 있다.	{"엘든 링","실사 영화","알렉스 가랜드"}	PUBLISHED	2026-04-21 14:20:26.886	2026-04-21 14:20:26.886	0
cmo8q2ea1000911b5mzfgrwt4	젠지, BNK 피어엑스 완파…결승서 3:0 셧아웃	lck-match-115604876650946535	2026-03-01 08:00:00	lolesports	Esports	LCK	fixed	젠지, BNK 피어엑스 완파…결승서 3:0 셧아웃	2026년 3월 1일 LCK 결승전에서 젠지가 BNK 피어엑스를 3:0으로 격파했다. 젠지는 무패 우승(3승 0패)을 확정했으며, BNK 피어엑스는 3승 2패로 준우승을 기록했다.	LCK 2026 시즌 결승전이 3월 1일 오전 진행된 가운데, 젠지가 BNK 피어엑스와의 BO5 경기에서 3:0으로 압도적 승리를 거두었다. 젠지는 결승 무패 진출로 우승을 확정 지었으며, 리그 우승 트로피를 품에 안게 됐다.\n\n이번 승리로 젠지는 정규시즌부터 플레이오프 전 구간에서 3승 0패의 완벽한 전적을 유지했다. 상대 BNK 피어엑스는 준우승에 머물렀으나, 3승 2패의 성적으로 시즌 최상위 팀들 사이의 치열한 경쟁을 펼친 것으로 확인됐다. 풀세트 접전 속에서도 젠지의 우위는 흔들리지 않았다.\n\n젠지의 이번 우승은 2026 LCK 시즌의 최강팀이 누구인지를 명확히 보여주는 결과다. 국제 대회 참가권을 확보한 젠지의 다음 행보에 이목이 집중된다.	{LCK,젠지,"BNK 피어엑스",결승,우승,3:0,2026시즌}	PUBLISHED	2026-04-21 14:31:37.417	2026-04-21 14:31:37.417	0
cmo8po5k1000i11mrxz2h3r1l	KeSPA, 찾아가는 교내 e스포츠 대회 참가 모집한다	https://www.gamemeca.com/view.php?gid=1774276	2026-04-21 03:04:07	게임메카	Esports	기타 Esports	claude	KeSPA, 2026년 교내 e스포츠 대회 참가 학교 모집 시작	한국e스포츠협회가 중·고등학생 대상 교내 e스포츠 사업을 본격 추진, 상반기 참여 학교를 5월 15일까지 모집	한국e스포츠협회는 2026년 중·고등학생을 위한 교내 e스포츠 사업을 시작한다. '찾아가는 교내 e스포츠 대회'는 시설이 부족한 학교에 전문 인력과 장비를 지원하며, 학생들이 대회 기획부터 운영까지 직접 참여할 수 있도록 설계됐다. 리그 오브 레전드, 발로란트, 브롤스타즈 3개 종목으로 진행된다.\n\n학생들은 선수, 지도자, 해설자, 중계방송 등 다양한 e스포츠 직업군을 직접 경험하며 진로를 탐색할 수 있다. 상반기 프로그램은 5월 15일까지 학교를 모집한 뒤 5월 11일부터 7월 24일까지 운영되며, 하반기는 7월 10일부터 8월 14일까지 모집해 8월 31일부터 11월 20일까지 진행된다.\n\n협회는 동시에 전국 규모의 중고교대회도 구성했다. e스포츠 관심층 저변 확대를 위한 '오픈서킷', 전문 선수 육성을 위한 '스쿨리그', 그리고 지자체·청소년 단체 대회를 공인하는 '유스포인트 대회'로 구성되어 있다. 11월 전국본선과 12월 전국결선을 통해 최종 우승팀을 결정하며, 리그 오브 레전드, 발로란트, 배틀그라운드 3개 종목으로 진행된다.	{KeSPA,e스포츠,교내대회,중고등학생}	PUBLISHED	2026-04-21 14:20:32.929	2026-04-21 14:20:32.929	0
cmo8po9zb000j11mrr27twa6k	레이서 카이사 등장, 롤 와일드 리프트 포르쉐 컬래버 예고	https://www.gamemeca.com/view.php?gid=1774275	2026-04-21 02:59:39	게임메카	PC	리그오브레전드	keyword	와일드 리프트, 포르쉐와 손잡고 '레이서 카이사' 스킨 공개	리그 오브 레전드: 와일드 리프트가 포르쉐와 협업해 포르쉐 911 GT3에서 영감을 받은 '프레스티지 셀렉트 네온 레이서 카이사' 스킨을 선보인다.	리그 오브 레전드: 와일드 리프트가 스포츠카 제조사 포르쉐와 협력해 특별한 인게임 스킨을 공개했다. 포르쉐의 최신 모델 911 GT3에서 영감을 받아 공동 디자인한 '프레스티지 셀렉트 네온 레이서 카이사' 스킨이 그것이다. 이 스킨은 포르쉐의 고성능 스포츠카 디자인과 네온 레이서 컨셉을 결합해 고급스러운 외관과 스피드감을 동시에 표현했다.\n\n해당 스킨은 4월 30일부터 5월 31일까지 진행되는 인게임 이벤트 '네온 레이서 그랑프리'를 통해 획득 가능하다. 동시에 카이사를 포함해 이렐리아, 제드, 오로라, 헤카림, 그라가스 등 6종의 네온 레이서 테마 스킨이 4월 30일 출시되며, 이 중 그라가스 스킨은 이벤트 참여 시 무료로 제공된다. 아울러 '무무무작위 총력전' 모드에는 레이싱 테마의 맵과 신규 증강 기능이 추가돼 색다른 플레이 경험을 선사한다.\n\n라이엇 게임즈는 이번 파트너십을 기념해 한국 플레이어를 대상으로 첫 오프라인 팝업 행사를 진행한다. 4인조 걸밴드 QWER의 히나가 한국 뮤즈로 참여하며, 프레스티지 셀렉트 네온 레이서 카이사의 스플래시 아트 콘셉트에 맞춘 특별 키 비주얼을 촬영했다.	{"와일드 리프트","포르쉐 콜래버",신스킨}	PUBLISHED	2026-04-21 14:20:38.662	2026-04-21 14:20:38.662	0
cmo8pof1a000k11mry9w32ueh	부스트 서버 포함, 뮤 온라인 클래스 리뉴얼 업데이트	https://www.gamemeca.com/view.php?gid=1774274	2026-04-21 02:53:51	게임메카	PC	기타 PC	claude	웹젠, 뮤 온라인 5개 클래스 리뉴얼 및 부스트 서버 오픈	뮤 온라인이 일루전나이트 등 5종 클래스 성능을 개선하고 빠른 육성용 스피드 서버를 출시했다.	웹젠은 21일 PC MMORPG 뮤 온라인에서 일루전나이트, 요정, 메이지, 마검사, 건크래셔 5종 클래스의 대규모 리뉴얼을 단행했다. 각 클래스의 고유 특성을 강화하는 데 초점을 맞춰 전투 위력과 스킬 공격력을 상향 조정했으며, 일부 클래스에는 새로운 전용 무기가 추가됐다.\n\n신규 플레이어 유입을 위해 개설된 스피드 서버는 빠른 캐릭터 육성에 특화돼 있다. 일부 던전의 경험치가 대폭 상향되며, 패스트 트랙 상품을 이용하면 3차 전직 완료 상태인 400레벨부터 시작할 수 있다. 스피드 서버에서 육성한 캐릭터는 본 서버로 무상 이전 가능하며, 이전 시 육성 정도에 따른 보상과 1,200레벨까지의 추가 육성 지원을 받는다.\n\n무료 회원 뮤 블루 사용자들은 스피드 서버의 캐릭터를 신규 서버 노리아로 이전할 수 있고, 해당 서버에서 기간제 무료 비약 등 전용 혜택을 누릴 수 있다. 이번 업데이트는 오래된 클래스 밸런스 문제를 해결하면서 동시에 신규 및 복귀 플레이어의 시작 진입장벽을 낮추는 전략으로 평가된다.	{뮤온라인,클래스리뉴얼,MMORPG,웹젠,스피드서버}	PUBLISHED	2026-04-21 14:20:45.214	2026-04-21 14:20:45.214	0
cmpcj1jym002gaa8aib3jfths	Five Xbox Games Are Set To Be Delisted In May & June 2026	https://www.purexbox.com/news/2026/05/five-xbox-games-are-set-to-be-delisted-in-may-and-june-2026	2026-05-15 13:30:00	Pure Xbox	Console	Xbox	fixed	Xbox, 5월-6월 디지털 라이선스 말소 예정... '배틀필드 하드라인' 등 5종 제거 임박	EA의 2015년 슈터 '배틀필드 하드라인'을 필두로 Xbox 디지털 스토어에서 5개 타이틀이 순차적으로 판매 중단되며, 5월 중순 할인 기간 내 구매 결정이 필수인 상황으로 확인됐다.	Xbox 디지털 라이선스 정책에 따른 주기적 게임 말소가 올해 5월-6월에 집중된다. EA의 '배틀필드 하드라인'이 5월 22일 공식 판매 중단(Delisting)을 앞두고 있으며, 레고 2K 드라이브와 추가 3종의 타이틀까지 포함되면서 반년도의 누적 이용권 소실 규모가 상당할 것으로 예상된다. 이는 라이선스 만료, 서버 종료, 퍼블리셔의 유통 전략 변경 등 복합적 요인이 작용한 결과다.\n\n'배틀필드 하드라인'의 경우 5월 중순까지 Xbox Store에서 대폭 할인된 가격으로 구매 가능하며, 이 기간 내 구입하면 향후 라이선스 갱신 없이도 캠페인 플레이가 보장된다. 다만 6월 예정된 멀티플레이 서버 종료로 인해 온라인 경험은 완전히 불가능해질 예정이다. 국내 Xbox 게이머들의 경우 Game Pass 구독자라면 서비스 내 포함 여부를 확인 후 결정하는 것이 비용 효율적이다.\n\n마이크로소프트는 매년 라이선스 만료에 따른 디지털 게임 말소를 진행하고 있으며, 이는 글로벌 퍼블리셔와의 유통권 계약 갱신 불가 사항이다. 특히 EA, Activision Blizzard, Ubisoft 등 대형 퍼블리셔의 레거시 타이틀들이 집중적으로 영향을 받는 추세로, Game Pass 기반 서브스크립션 모델로의 전환 가속화가 배경으로 작용하고 있다. 향후 유사 말소 소식은 공식 Xbox 뉴스레터 또는 한국 Xbox 커뮤니티를 통해 선제적으로 확인하는 것이 권장된다.\n\n**국내 이용자 가이드:**\n- 한국어 지원: 배틀필드 하드라인 자막 미지원\n- 구매 가격: 5월 중순 한시적 할인 진행 (정가 기준 약 13,200원대 예상)\n- 구매 방법: Xbox 디지털 스토어 또는 Game Pass 포함 여부 확인 필수\n- 주의사항: 구매 후 6월 멀티플레이 서버 종료로 캠페인만 플레이 가능	{Xbox,"배틀필드 하드라인","디지털 라이선스","레고 2K 드라이브","라이선스 말소","Game Pass"}	PUBLISHED	2026-05-19 11:05:47.854	2026-05-19 11:05:47.854	0
cmpcj1so9002haa8aqdlsn9qx	Forza Horizon 6 Is Immensely Popular Already, Even In Early Access	https://www.purexbox.com/news/2026/05/forza-horizon-6-is-immensely-popular-already-even-in-early-access	2026-05-15 13:00:00	Pure Xbox	Console	Xbox	fixed	Xbox Game Pass 일일 출시에도 불구하고... 포르자 호라이즌 6, 스팀에서 동시접속 15만 돌파	마이크로소프트 퍼스트파티 게임이 Game Pass 출시 첫날에도 스팀에서 정가 구매를 통해 15만 명의 동시접속을 기록하며, 구독 서비스 시대에서도 고가 타이틀의 매력이 여전함을 증명했다.	포르자 호라이즌 6(Forza Horizon 6)이 얼리 액세스 단계에서 벌써 전 플랫폼을 통틀어 화제의 중심이 됐다. 마이크로소프트의 주요 타이틀들은 Xbox와 PC에서 Game Pass 가입 첫날부터 플레이 가능한 것이 일반적이지만, 포르자 호라이즌 6은 스팀 플랫폼에서 정가 구매 고객들까지 몰려들면서 이 공식의 예외를 증명하고 있다.\n\n스팀DB(SteamDB) 기준으로 포르자 호라이즌 6의 동시접속 플레이어는 이미 15만 명을 돌파했으며, 이는 특히 주목할 점이 있다. 스팀에서 게임을 플레이하기 위해서는 약 15만 원대(£109.99 / $119.99)의 프리미엄 가격을 지불해야 한다는 점이다. 얼리 액세스 단계임에도 불구하고 고가의 진입장벽을 넘어 이 같은 플레이어 수를 달성한 것은 게임의 완성도와 브랜드 파워가 Game Pass 무료 플레이를 상쇄할 만큼 강력하다는 뜻이다.\n\n이 현상은 구독 게임 서비스 시대에서도 AAA급 신작이 가지는 가치를 단적으로 보여준다. Playground Games가 개발한 이 오픈월드 레이싱 게임은 Xbox와 PC용 Game Pass에 무료 제공되지만, 정가로 스팀 버전을 구매하는 유저들이 이렇게 많다는 것은 △플랫폼 선호도 △게임 성능(스팀 데크 호환성 포함) △실시간 멀티플레이 커뮤니티 활성화 등의 요소가 여전히 구매 결정에 영향을 미친다는 의미다. 이는 마이크로소프트의 Game Pass First 전략이 유저 확보에는 성공했으나, 동시에 프리미엄 게임으로서의 가치도 훼손하지 않았음을 시사한다.\n\n**[국내 유저 가이드]** 포르자 호라이즌 6는 현재 얼리 액세스 단계이며, Xbox Game Pass 가입자는 별도 비용 없이 즉시 플레이 가능하다. 스팀 정식 출시 가격은 약 15만 원대이며, 한국어 자막 지원 여부는 출시 후 공식 확인이 필요하다. 국내에서는 Xbox Game Pass Ultimate(월 16,500원 또는 연 165,000원) 가입을 통한 플레이를 가장 경제적인 방법으로 추천한다.	{Xbox,"PC (Steam)","포르자 호라이즌 6","Game Pass","얼리 액세스","오픈월드 레이싱"}	PUBLISHED	2026-05-19 11:05:59.145	2026-05-19 11:05:59.145	0
cmpcj31yu002naa8ahg3hhogc	No Gravity Games Is Giving Away 6 Free Switch Games This Month	https://www.nintendolife.com/news/2026/05/no-gravity-games-is-giving-away-6-free-switch-games-this-month	2026-05-18 17:30:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch, No Gravity Games의 '픽셀 카오스 기브어웨이' 개최... 5월 19일부터 6종 무료 배포	인디 게임 퍼블리셔 No Gravity Games가 5월 19일부터 24일까지 'Pixel Chaos Giveaway' 이벤트를 통해 자사 타이틀 6종을 매일 1개씩 무료 배포한다. Switch 유저라면 누구나 eShop에서 무료로 획득 가능한 기간 한정 프로모션이다.	인디 게임 퍼블리셔 No Gravity Games가 Nintendo Switch 플랫폼을 겨냥한 대규모 무료 배포 이벤트 '픽셀 카오스 기브어웨이'를 공식 발표했다. 5월 19일부터 24일까지 6일간 진행되는 이번 캠페인은 매일 자사 발행작 1종씩을 완전 무료로 제공하는 방식으로 운영된다. 국내 Switch 사용자들도 해당 기간 내 eShop에서 동일한 조건으로 게임을 다운로드할 수 있다.\n\n이번 이벤트에 포함되는 6종의 게임들은 모두 No Gravity Games의 인디 포트폴리오에 속하는 타이틀들로, 일일 기준 자정(협정 세계시 기준)을 경계로 무료 기간이 종료되고 다음 작품이 공개되는 방식이다. Switch의 eShop 구조상 한번 구매 또는 무료 획득한 게임은 계정에 영구 보관되므로, 기간 내에 6종 모두를 수집할 수 있다. 각 타이틀의 구체적인 장르와 규격은 공식 발표 예정이다.\n\nNo Gravity Games는 인디 개발사 지원과 Switch 플랫폼 활성화를 목표로 주기적인 무료 배포 캠페인을 진행해왔다. 이러한 전략은 Nintendo eShop의 방대한 타이틀 라이브러리 속에서 신작 게임의 가시성을 높이고, 소비자들의 구매 진입장벽을 낮추려는 퍼블리셔들의 표준 마케팅 수법으로 자리잡았다. Switch의 높은 접근성과 결합하면 단기간의 다운로드 수 급증으로 이어질 수 있어, 이후 유료 DLC나 시리즈 타이틀 판매 촉진 효과까지 기대할 수 있다.\n\n**출시 정보**: 이벤트는 5월 19일(현지시간 기준)부터 시작되며, 국내 Nintendo eShop에서 동일하게 참여 가능하다. 별도의 구매 과정 없이 eShop 앱 내 '무료 게임' 섹션에서 직접 '획득'하면 된다. 추후 게임 패스(Game Pass for Switch) 같은 구독 서비스와의 연동 여부는 미확인 상태이며, 각 타이틀별 한국어 자막 지원 여부는 개별 확인이 필요하다.	{"Nintendo Switch","No Gravity Games","무료 게임 배포",eShop,"픽셀 카오스 기브어웨이"}	PUBLISHED	2026-05-19 11:06:57.846	2026-05-19 11:06:57.846	0
cmo8poq9l000m11mrjdbxndmh	총 영웅 144종 등장, 서머너즈 워 '영웅 던전 리턴즈' 실시	https://www.gamemeca.com/view.php?gid=1774285	2026-04-21 02:43:00	게임메카	Mobile	기타 Mobile	claude	서머너즈 워, 12주년 기념 '영웅 던전 리턴즈' 개최...역대 최대 144종 몬스터 등장	서머너즈 워가 12주년을 맞아 10주간 '영헙 던전 리턴즈' 이벤트를 진행. 144종 몬스터 중 매주 1마리씩 선택해 던전 공략 가능.	컴투스는 '서머너즈 워: 천공의 아레나'의 12주년을 기념해 '영웅 던전 리턴즈' 이벤트를 6월 28일까지 10주간 운영한다. 이번 이벤트는 서비스 초기부터 현재까지 추가된 몬스터 중 역대 최대 규모인 144종을 라인업에 포함시켰다.\n\n참가자는 매주 속성 제한 없이 1마리씩 총 10마리의 몬스터를 자유롭게 선택해 던전을 개방하고 클리어할 수 있다. 선택 던전을 10층까지 완료하면 해당 몬스터 소환서 조각 250개를 획득하며, 매주 5층 이상 클리어 시 신비의 소환서 3장이 지급돼 이벤트 기간 최대 30장을 받을 수 있다. 누적 클리어 층수에 따라 12주년 빛·어둠 소환서, 신비의 소환서, 데빌몬 등이 특별 보상으로 제공된다.\n\n컴투스는 영웅 던전 리턴즈 외에도 태생 5성 몬스터 전 스킬 강화 상태 획득, 스킬 레벨업 지원 등 성장 기회를 함께 제공한다. '소환 마일리지 시스템'과 '특별 과제' 등 유저 편의 콘텐츠도 새롭게 도입했으며, 12주년 축제는 다양한 즐길 거리로 지속될 예정이다.	{"서머너즈 워",12주년,이벤트}	PUBLISHED	2026-04-21 14:20:59.769	2026-04-21 14:20:59.769	0
cmo8povba000n11mr804x27qb	위메이드·비댁스, 스테이블코인 결제 표준 구축 협약	https://www.gamemeca.com/view.php?gid=1774284	2026-04-21 02:28:01	게임메카	기타	기타 기타	claude	위메이드·비댁스, 국내 스테이블코인 결제 표준 모델 공동 개발	위메이드와 비댁스가 스테이블코인 결제 사업화를 위한 업무협약 체결	위메이드와 디지털 자산 수탁 기업 비댁스가 스테이블코인 결제 모델 공동 개발을 위한 업무협약을 체결했다. 양사는 위메이드의 금융 네트워크 기술과 비댁스의 규제 친화적 수탁 인프라를 결합하여 실제 사업화 가능한 국내 스테이블코인 결제 표준을 구축하는 것을 목표로 한다.\n\n위메이드가 개발한 원화 스테이블코인 전용 메인넷 스테이블넷을 비댁스의 수탁 지갑과 연동할 예정이다. 스테이블넷은 별도 가스 토큰 없이 원화 스테이블코인으로 거래 수수료를 지불할 수 있으며, 고객확인(KYC)과 자금세탁방지(AML) 같은 금융 규제 솔루션을 직접 지원한다. 비댁스는 가상자산사업자 자격과 정보보호관리체계 인증, 글로벌 보안 인증을 기반으로 안전한 수탁 환경을 제공한다.\n\n양사는 준비금 관리 모델과 수탁자산 운용 아키텍처를 공동으로 설계하며, 금융기관을 대상으로 기술검증을 진행할 계획이다. 신규 사업 발굴 시 상호 우선 파트너로 삼아 국내 스테이블코인 생태계 확장을 추진한다.	{스테이블코인,블록체인,위메이드}	PUBLISHED	2026-04-21 14:21:06.31	2026-04-21 14:21:06.31	0
cmo8pp1bn000o11mrxz4o4b4u	SOOP과 BFX 파트너십, e스포츠 콘텐츠 강화한다	https://www.gamemeca.com/view.php?gid=1774281	2026-04-21 02:22:20	게임메카	Esports	기타 Esports	claude	SOOP, BNK 피어엑스와 2028년까지 독점 파트너십 체결	라이브 스트리밍 플랫폼 SOOP이 e스포츠 구단 BNK 피어엑스와 전략적 파트너십을 통해 선수 개인 방송과 협업 콘텐츠를 확대한다.	라이브 스트리밍 플랫폼 SOOP이 e스포츠 구단 BNK 피어엑스(BFX)와 2028년까지의 장기 파트너십을 공식 발표했다. 이번 협력을 통해 두 회사는 리그 오브 레전드와 FC 온라인 종목 선수들의 개인 방송을 SOOP에서 단독 운영하며, 팬과 선수 간 상호작용을 강화할 방침이다.\n\nBFX 소속 선수들은 SOOP 플랫폼에서 개인 방송을 진행하며, SOOP은 프로게이머와 스트리머의 협업 콘텐츠를 활성화해 기존 e스포츠 팬층과 일반 스트리밍 시청자를 연결한다. 양사는 추가로 오프라인 행사와 팬 이벤트를 공동으로 기획해 관객이 직접 참여할 수 있는 경험을 제공할 계획이다.\n\n이번 파트너십은 e스포츠 콘텐츠의 플랫폼화와 팬 경험 고도화를 목표로 한다. SOOP은 프로 선수의 개인 브랜드 강화를 지원하면서 동시에 플랫폼의 e스포츠 카테고리 경쟁력을 확보할 수 있으며, BFX는 선수들의 팬 접근성을 높이는 기회를 얻게 된다.	{SOOP,BNK피어엑스,e스포츠,스트리밍,LoL,FC온라인}	PUBLISHED	2026-04-21 14:21:14.099	2026-04-21 14:21:14.099	0
cmo8pp5wi000p11mrxz8ja55k	미래 성장 강조, 위메이드 공식 홈페이지 개편	https://www.gamemeca.com/view.php?gid=1774280	2026-04-21 02:15:33	게임메카	기타	기타 기타	claude	위메이드, 글로벌 정체성 강화한 신규 기업 홈페이지 공개	위메이드가 UI·UX를 개편한 새 공식 홈페이지를 21일 오픈하고 '미래 성장' 메시지 강조	위메이드는 글로벌 기업으로서의 정체성을 드러내기 위해 기업 공식 홈페이지를 완전히 개편했다. 새로운 홈페이지는 직관적인 인터페이스로 게임 라인업, 블록체인 사업, 파트너십 현황 등을 한눈에 파악할 수 있도록 구성했다.\n\n개편된 홈페이지는 기업 소개와 뉴스, 채용 정보뿐 아니라 해외 기업과의 협업 사례와 스튜디오 협업 현황을 별도 메뉴로 마련했다. 글로벌 이용자와 파트너사가 위메이드의 사업 현황과 협업 기회를 쉽게 탐색할 수 있도록 설계한 것이다.\n\n위메이드는 기업 방향성을 담은 메시지 '메이드 포 더 퓨처(MADE FOR THE FUTURE)'를 함께 공개했다. 이는 지난 26년간 축적한 게임 IP와 기술력을 바탕으로 미래 세대에 경쟁력을 이어가겠다는 의미를 담고 있다. 홈페이지는 향후 신규 게임 출시와 블록체인 플랫폼 고도화에 맞춰 지속적으로 확대될 예정이다.	{위메이드,기업뉴스,브랜드}	PUBLISHED	2026-04-21 14:21:20.034	2026-04-21 14:21:20.034	0
cmo8q35ja000f11b5iklwsxgt	한진 브리온, BNK 피어엑스 완파...셧아웃 승리로 하강선 돌파	lck-match-115548128962840667	2026-04-03 10:00:00	lolesports	Esports	LCK	fixed	한진 브리온, BNK 피어엑스 완파...셧아웃 승리로 하강선 돌파	4월 3일 오전 10시 한진 브리온이 BNK 피어엑스를 2:0으로 제압했다. 풀세트 접전 끝 나온 승리로, 한진 브리온은 1승 5패에서 한 계단 올라설 수 있는 기회를 맞게 됐다.	한진 브리온이 4월 3일 2026 LCK 1주차 경기에서 BNK 피어엑스를 2:0으로 완파했다. 양 팀 모두 치열한 공방을 펼쳤으나 결국 한진 브리온이 풀세트 접전을 제압하는 형태로 경기를 마무리했다.\n\n이번 승리는 현재 1승 5패로 리그 하위권에 머물러 있던 한진 브리온에게 중요한 포인트다. 셧아웃 승리를 통해 팀의 모멘텀을 되찾을 수 있는 계기가 마련되었다. 반면 BNK 피어엑스는 2승 4패의 전적에서 한 경기를 더하며 순위 경쟁에서 밀려나게 되었다.\n\n한진 브리온은 이번 승리를 발판으로 중위권 복귀를 노리고 있는 상황이다. 향후 경기 운영에서 이번 접전식 경기 경험이 긍정적 자산으로 작용할 수 있을 것으로 보인다.	{LCK,"한진 브리온","BNK 피어엑스","2:0 완파",1주차,이스포츠}	PUBLISHED	2026-04-21 14:32:12.742	2026-04-21 14:32:12.742	0
cmo8ppfgj000r11mrq2nledr3	사이게임즈 'SKO 2026 시즌 1' 성료, 시즌 2는 10월 예고	https://www.gamemeca.com/view.php?gid=1774262	2026-04-20 08:55:26	게임메카	기타	기타 기타	claude	Beita, 섀도우버스 코리아 오픈 2026 시즌 1 우승...국제 대회 한국 대표 확정	사이게임즈의 섀도우버스 공식 e스포츠 대회에서 Beita 선수가 우승을 차지하고 국제 대회 출전권을 획득했다.	사이게임즈가 개최한 섀도우버스 코리아 오픈 2026 시즌 1에서 Beita 선수가 최종 우승을 차지했다. 지난 19일 진행된 본선 및 결승전에는 예선을 통과한 8명의 선수가 참가했으며, Beita 선수는 결승전에서 자판기 선수를 2대 1로 꺾고 정상에 올랐다.\n\n우승으로 Beita 선수는 1,000만 원의 상금과 함께 12월 일본에서 열리는 섀도우버스 월드 그랑프리 2026에 한국 대표로 출전할 기회를 얻었다. 해당 국제 대회의 우승 상금은 1억 엔(약 9억 3,500만 원)에 달한다.\n\nBeita 선수는 우승 소감에서 "오랜 시간을 기다려온 만큼 좋은 결실을 맺게 되어 기쁘다"며 "앞으로 더 좋은 모습을 보여드릴 수 있도록 노력하겠다"고 밝혔다. 한편 사이게임즈는 시즌 2를 10월에 개최할 예정이다.	{섀도우버스,e스포츠,Beita}	PUBLISHED	2026-04-21 14:21:32.42	2026-04-21 14:21:32.42	0
cmo8q14vo000011b5newddttl	BNK 피어엑스, DN 수퍼스 꺾고 플레이오프 승리…풀세트 접전 끝 신승	lck-match-115604876650946481	2026-02-12 08:00:00	lolesports	Esports	LCK	fixed	BNK 피어엑스, DN 수퍼스 꺾고 플레이오프 승리…풀세트 접전 끝 신승	2026년 2월 12일 LCK 플레이오프에서 BNK 피어엑스가 DN 수퍼스를 3:2로 꺾었다. 5세트까지 이어진 치열한 접전에서 최종 승자로 올라선 BNK는 플레이오프 전적 3승 2패를 기록했다.	BNK 피어엑스가 DN 수퍼스와의 LCK 플레이오프 BO5 경기에서 3:2로 역전 승리를 거두며 상위 진출을 확보했다. 2월 12일 진행된 이 경기는 5세트까지 풀세트 접전으로 펼쳐졌으며, BNK는 최종 세트에서 상대를 제압하는 집중력을 보였다.\n\n이 승리로 BNK 피어엑스는 플레이오프 전적 3승 2패로 기록을 업데이트했다. 반면 DN 수퍼스는 1승 2패로 남겨지며 플레이오프에서의 입지가 좁혀졌다. 양 팀이 보여준 박진감 있는 경기 운영은 LCK 플레이오프의 경쟁 강도를 여실히 드러냈다.\n\nBNK 피어엑스는 이번 승리를 발판으로 플레이오프 상위권 팀들과의 경쟁에서 입지를 다질 것으로 예상된다. DN 수퍼스는 후속 경기에서의 추가 승리로 리그의 순위 경합에 재진입해야 하는 상황이 되었다.	{LCK,플레이오프,BNK피어엑스,DN수퍼스,BO5,풀세트접전}	PUBLISHED	2026-04-21 14:30:38.568	2026-04-21 14:30:38.568	0
cmo8q19wd000111b52jw4i4ab	디플러스 기아, 키움 DRX 꺾고 플레이오프 생존 BO5 풀세트 접전 끝 승리	lck-match-115604876650946487	2026-02-13 08:00:00	lolesports	Esports	LCK	fixed	디플러스 기아, 키움 DRX 꺾고 플레이오프 생존 BO5 풀세트 접전 끝 승리	2026년 2월 13일 LCK 플레이오프에서 디플러스 기아가 키움 DRX와의 BO5 경기에서 3:2로 승리하며 생존을 확정했다.	13일 오전 진행된 LCK 플레이오프 BO5 경기에서 디플러스 기아가 키움 DRX를 3:2로 꺾었다. 양 팀이 5세트까지 가는 풀세트 접전을 벌인 끝에 디플러스 기아가 최종 승리를 거머쥐었다.\n\n이번 승리로 디플러스 기아는 플레이오프에서 3승 2패의 전적을 기록했다. 반면 키움 DRX는 0승 2패로 플레이오프 무대에서의 발걸음을 멈추게 됐다. 매 세트가 팽팽한 경합을 이루었던 만큼 두 팀 모두 최고 수준의 경쟁을 벌인 것으로 확인됐다.\n\n디플러스 기아는 이번 플레이오프 승리를 통해 리그 상위권 진출을 향한 다음 라운드 진출을 확정하게 됐다. 한편 이번 시리즈는 플레이오프 초반 경쟁력의 명암이 갈리는 계기가 되며, 남은 경기들이 최종 순위 결정에 중요한 역할을 할 것으로 예상된다.	{LCK,"디플러스 기아","키움 DRX",플레이오프,BO5,풀세트}	PUBLISHED	2026-04-21 14:30:45.085	2026-04-21 14:30:45.085	0
cmo8q1fh1000211b50z5wiu7k	젠지, 디플러스 기아 꺾고 플레이오프 4강 진출 확정	lck-match-115604876650946499	2026-02-14 08:00:00	lolesports	Esports	LCK	fixed	젠지, 디플러스 기아 꺾고 플레이오프 4강 진출 확정	2026년 2월 14일 LCK 플레이오프에서 젠지가 디플러스 기아를 3:1로 격퇴, 결승 진출권을 확보했다.	젠지가 14일 오전 LCK 플레이오프 준결승에서 디플러스 기아와의 BO5 접전을 3:1로 승리, 결승 진출을 확정지었다. 풀세트 접전 끝에 거둔 이번 승리로 젠지는 플레이오프 전승행진(3승 0패)을 이어가며 최강 팀의 위상을 입증했다.\n\n이번 경기는 양 팀의 실력이 맞닿은 접전으로 진행됐다. 디플러스 기아는 시리즈 중반 한 세트를 탈취하며 선제 도전의 의지를 드러냈으나, 젠지의 안정적인 경기 운영과 클로징 능력 앞에 3:1로 무너졌다. 디플러스 기아는 이번 패배로 플레이오프 전적 3승 2패를 기록하게 됐다.\n\n젠지는 현재 플레이오프 결승행 티켓을 확보한 가운데, 나머지 준결승 경기의 승자와 결승을 겨루게 된다. 정규시즌 최강자로서의 면모를 플레이오프에서도 입증한 젠지의 우승 가능성이 높아지고 있으며, LCK 챔피언십 트로피의 최종 귀속은 더욱 주목된다.	{LCK,젠지,"디플러스 기아",플레이오프,3:1,"결승 진출"}	PUBLISHED	2026-04-21 14:30:52.309	2026-04-21 14:30:52.309	0
cmo8q1l74000311b5uxvgjq2a	BNK 피어엑스, T1 꺾고 플레이오프 생존... 3:1 신승으로 시리즈 동점	lck-match-115604876650946493	2026-02-15 08:00:00	lolesports	Esports	LCK	fixed	BNK 피어엑스, T1 꺾고 플레이오프 생존... 3:1 신승으로 시리즈 동점	2026년 2월 15일 LCK 플레이오프 경기에서 BNK 피어엑스가 T1을 3:1로 격파. 풀세트 접전 끝 승리를 거두며 3승 2패로 전적을 개선했다.	BNK 피어엑스가 2월 15일 LCK 플레이오프에서 T1과의 경기를 3:1로 승리하며 시리즈에서 생존했다. 2:1로 뒤지던 상황에서 4세트를 가져가 풀세트 접전을 제압하는 저력을 보여줬다. BNK 피어엑스는 현재 3승 2패 전적을 기록했다.\n\n이번 승리는 BNK 피어엑스에게 플레이오프 생존의 희망을 안겨줬다. 반면 T1은 이번 경기 패배로 0승 2패에 머물며 리그 진출 확정을 위한 경로가 더욱 좁혀진 상태다. 풀세트까지 가는 접전 끝에 패배를 기록한 만큼 T1에게는 향후 경기에서의 집중력 재정비가 시급할 것으로 판단된다.\n\n앞으로의 플레이오프 진행에서 BNK 피어엑스의 3:1 신승은 변수로 작용할 가능성이 높다. 풀세트 접전까지 가는 경기력을 보인 BNK 피어엑스가 향후 경기에서 이러한 저력을 지속할 수 있다면, 리그 전체 판도에 영향을 미칠 수 있을 것으로 예상된다.	{LCK,"BNK 피어엑스",T1,플레이오프,3:1,풀세트,이스포츠}	PUBLISHED	2026-04-21 14:30:59.728	2026-04-21 14:30:59.728	0
cmo8q1puv000411b5m62er5z2	DN 수퍼스, 키움 DRX 꺾고 플레이오프 첫 승리 '접전 끝 신승'	lck-match-115604876650946505	2026-02-19 08:00:00	lolesports	Esports	LCK	fixed	DN 수퍼스, 키움 DRX 꺾고 플레이오프 첫 승리 '접전 끝 신승'	2026년 2월 19일 LCK 플레이오프에서 DN 수퍼스가 키움 DRX와의 BO5 경기에서 3:1로 승리. DN 수퍼스는 1승 2패로 기록을 개선했으며, 키움 DRX는 0승 2패로 절벽 끝에 내몰렸다.	DN 수퍼스가 2월 19일 키움 DRX와의 LCK 플레이오프 BO5 경기에서 3:1로 승리를 거두며 플레이오프 첫 승리를 신고했다. 이날 경기는 풀세트 접전으로 진행됐으며, 최종 3:1의 스코어로 DN 수퍼스가 접전을 제압했다.\n\n이 승리로 DN 수퍼스는 1승 2패의 전적을 기록하며 플레이오프 진출을 확실히 했다. 반면 키움 DRX는 0승 2패로 리그 탈락 가능성이 급속도로 높아진 상황이다. 플레이오프의 생존 확률을 좌우하는 중요한 분기점이 된 이번 경기에서 DN 수퍼스의 저력이 빛을 발했다.\n\nDN 수퍼스는 다음 경기에서의 추가 승리를 통해 플레이오프 상위 진출을 노린다. 한편 키움 DRX는 리그 생존을 위해 남은 경기에서 필승을 강요받는 상황으로 접어들었다.	{LCK,DN수퍼스,키움DRX,플레이오프,BO5,경기결과}	PUBLISHED	2026-04-21 14:31:05.767	2026-04-21 14:31:05.767	0
cmo8q1vbe000511b569sj70a5	디플러스 기아, DN 수퍼스 3:1 신승…플레이오프 진격	lck-match-115604876650946517	2026-02-20 08:00:00	lolesports	Esports	LCK	fixed	디플러스 기아, DN 수퍼스 3:1 신승…플레이오프 진격	2026년 2월 20일 LCK 플레이오프에서 디플러스 기아가 DN 수퍼스를 3:1로 제압, 풀세트 접전 끝 승리를 거두며 상위 시드 진출에 한 발 더 다가섰다.	디플러스 기아는 20일 진행된 LCK 플레이오프 BO5 경기에서 DN 수퍼스를 3:1로 격파했다. 풀세트까지 진행된 이번 경기는 양 팀의 치열한 접전이 이어졌으나, 후반부로 갈수록 디플러스 기아의 우위가 돋보였다.\n\n이번 승리로 디플러스 기아는 현재 3승 2패를 기록하며 플레이오프 상위권 경합에서 우위를 점하게 됐다. 반면 DN 수퍼스는 1승 2패로 기록되며 하위 시드로의 추락 위험에 직면했다. 디플러스 기아는 동일 전적의 팀들과의 직접 대면에서 이번 승리를 통해 득실차 경쟁에서 주도권을 확보한 것으로 평가된다.\n\n남은 플레이오프 일정에서 디플러스 기아는 추가 승리를 통해 플레이오프 상위 시드 확보를 목표로 할 예정이며, DN 수퍼스는 하위 시드 전락을 막기 위해 향후 경기에서 반드시 연승을 거두어야 하는 상황이 됐다.	{LCK,"디플러스 기아","DN 수퍼스",플레이오프,3:1,BO5}	PUBLISHED	2026-04-21 14:31:12.842	2026-04-21 14:31:12.842	0
cmo8q201t000611b5qnu8lrzz	젠지, BNK 피어엑스 꺾고 플레이오프 4강 진출 확정	lck-match-115604876650946511	2026-02-21 08:00:00	lolesports	Esports	LCK	fixed	젠지, BNK 피어엑스 꺾고 플레이오프 4강 진출 확정	2월 21일 플레이오프 반결승전에서 젠지가 BNK 피어엑스를 3:1로 제압하며 최종 3승 0패의 무패 우승 행진을 이어갔다.	젠지는 21일 진행된 2026 LCK 플레이오프 반결승전에서 BNK 피어엑스와의 BO5 매치에서 3:1로 승리했다. 이번 승리로 젠지는 플레이오프 4강 진출을 확정 지었으며, 현재까지 패배 없이 3연승을 기록 중이다.\n\n본 경기는 풀세트 접전으로 평가되는 만큼 BNK 피어엑스도 선전했으나, 결과적으로 젠지의 우위가 확인됐다. 젠지는 현재 3승 0패의 무패 상태를 유지하고 있으며, BNK 피어엑스는 3승 2패의 전적으로 플레이오프 진행 과정에서 패배를 기록했다.\n\n젠지는 플레이오프 4강에서 다음 상대와의 맞대결을 준비하게 된다. 현재의 무패 행진이 이어질 경우 우승 트로피에 한 발 더 가까워질 것으로 예상된다. 한편 BNK 피어엑스는 패자 조 진행으로 추가 경기 기회가 주어질 예정이다.	{LCK,젠지,BNK피어엑스,플레이오프,반결승,3:1승리}	PUBLISHED	2026-04-21 14:31:18.977	2026-04-21 14:31:18.977	0
cmo8q24pq000711b5848n54lq	디플러스 기아, T1 꺾고 플레이오프 생존...풀세트 접전 끝 3:2 신승	lck-match-115604876650946523	2026-02-22 08:00:00	lolesports	Esports	LCK	fixed	디플러스 기아, T1 꺾고 플레이오프 생존...풀세트 접전 끝 3:2 신승	2026년 2월 22일 LCK 플레이오프에서 디플러스 기아가 T1을 3:2로 꺾었다. 풀세트 접전 끝의 승리로 디플러스 기아는 3승 2패를 기록했고, T1은 0승 2패로 패배를 당했다.	LCK 플레이오프 무대에서 디플러스 기아가 T1을 상대로 3:2의 풀세트 접전을 펼쳐 신승을 거두었다. 2026년 2월 22일 오전 8시에 진행된 이 경기는 5판의 하이라이트 매칭으로, 양 팀의 치열한 명암이 교차하는 가운데 진행됐다.\n\n이번 승리로 디플러스 기아는 현재 3승 2패의 전적을 기록하며 플레이오프 생존 가도를 이어갔다. 반면 T1은 0승 2패라는 전적으로 상당한 위기 상황에 처해 있으며, 이후 경기에서의 분전이 요구된다.\n\n플레이오프의 특성상 한 경기의 무게감이 상이하는 만큼, 양 팀 모두 다음 경기에 대한 재정비가 중요한 시점이다. 디플러스 기아는 이번 승리의 탄력을 바탕으로 상위권 진출을 노려볼 수 있으며, T1은 긴급 모드에 돌입하여 연승의 필요성이 대두되고 있다.	{LCK,플레이오프,"디플러스 기아",T1,3:2,풀세트,이스포츠}	PUBLISHED	2026-04-21 14:31:25.022	2026-04-21 14:31:25.022	0
cmo8q2j3d000a11b5q0nmkquo	한화생명, 한진 브리온 완파...1주 차 첫 경기 압도	lck-match-115548128962840607	2026-04-01 08:00:00	lolesports	Esports	LCK	fixed	한화생명, 한진 브리온 완파...1주 차 첫 경기 압도	2026 LCK 1주 차, 한화생명 e스포츠가 한진 브리온을 2:0 셧아웃으로 제압. 현지시간 4월 1일 오전 경기 결과, 한화생명은 5승 1패로 순위권 위치를 공고히 했다.	한화생명 e스포츠가 2026시즌 LCK 1주 차 개막전에서 한진 브리온을 2:0 완파로 제압했다. 4월 1일 오전 8시에 진행된 BO3 경기에서 한화생명은 풀세트 접전 끝에 양 게임을 가져가며 압도적 승리를 거두었다.\n\n이번 승리로 한화생명은 1주 차 현재 5승 1패를 기록, 상위권 위치를 점유하고 있다. 반면 한진 브리온은 1주 차 1승 5패로 리그 초반 고전을 면치 못하고 있다. 한화생명의 이번 완승은 팀의 안정적인 세트 운영과 게임 장악력을 여실히 드러내는 결과로 평가된다.\n\n한화생명은 1주 차 남은 경기를 통해 상위권 입지를 더욱 굳혀야 할 시점이며, 한진 브리온은 즉각적인 경기력 개선이 요구되는 상황이다. 향후 두 팀의 경기력 변화는 LCK 초반 순위표 재편성에 영향을 미칠 것으로 예상된다.	{LCK,한화생명,한진브리온,"2:0 완파",1주차,이스포츠}	PUBLISHED	2026-04-21 14:31:43.657	2026-04-21 14:31:43.657	0
cmo8q2ncx000b11b531p6ztms	KT 롤스터, T1 완파…'6연승' 순항 지속	lck-match-115548128962840651	2026-04-01 10:00:00	lolesports	Esports	LCK	fixed	KT 롤스터, T1 완파…'6연승' 순항 지속	2026년 4월 1일 LCK 1주 차 경기에서 KT 롤스터가 T1을 2:0으로 완파했다. KT는 6승 무패의 맹주 자리를 굳혔고, T1은 3승 3패로 중원 그룹에 머물렀다.	KT 롤스터가 T1을 상대로 2:0 완승을 거두며 리그 최고 수위 기록을 이어갔다. 2026년 4월 1일 오후 진행된 이번 경기는 풀세트 접전 양상을 보였으나, 결과적으로 KT 롤스터가 모든 세트를 장악하며 승리를 확정했다.\n\nKT 롤스터는 이번 승리로 6승 무패의 완벽한 전적을 유지하며 리그 최정상의 위치를 공고히 했다. 반면 T1은 3승 3패의 동등한 전적으로 중위권 그룹에 위치하게 되었으며, 상위권 팀과의 격차를 좁혀야 할 과제를 안게 됐다.\n\nKT 롤스터는 다음 경기에서도 현재의 승리 흐름을 이어갈 수 있을지 주목된다. 한편 T1은 최근 전적 부진을 탈피하기 위해 전술 개선과 팀 결집력 강화가 시급한 상황으로 평가된다.	{LCK,"KT 롤스터",T1,완파,2026시즌}	PUBLISHED	2026-04-21 14:31:49.185	2026-04-21 14:31:49.185	0
cmo8q2ry0000c11b59wmhuj4i	농심 레드포스, 디플러스 기아 완파…셧아웃으로 선두 다지기	lck-match-115548128962906291	2026-04-02 08:00:00	lolesports	Esports	LCK	fixed	농심 레드포스, 디플러스 기아 완파…셧아웃으로 선두 다지기	농심 레드포스가 2026 LCK 1주 차 경기에서 디플러스 기아를 2:0으로 완파했다. 풀세트 접전 끝의 승리로 4승 2패 기록을 수립했다.	농심 레드포스가 4월 2일 오전 8시 진행된 디플러스 기아와의 경기에서 2:0 완승을 거두며 리그 상위권 위치를 공고히 했다. 양 팀의 풀세트 접전으로 평가받은 이번 경기는 농심 레드포스의 각 세트별 우수한 운영 능력을 입증했다.\n\n이번 승리로 농심 레드포스는 4승 2패의 성적을 기록하며 현재 리그 상위권을 유지 중이다. 반면 디플러스 기아는 3승 3패로 동점이지만 득실차 측면에서 뒤쳐진 상황이 확정됐다. 풀세트 경합 속에서도 승리를 거둔 농심 레드포스는 팀의 안정성과 집중력을 여실히 드러냈다.\n\n농심 레드포스는 다음 경기를 통해 연승 가도를 이어갈 수 있을지 주목된다. 한편 디플러스 기아는 3패 고착으로 상위권 재진입을 위해 즉각적인 감점 회복이 요구되는 상황이다.	{LCK,"농심 레드포스","디플러스 기아","2:0 완파",이스포츠}	PUBLISHED	2026-04-21 14:31:55.128	2026-04-21 14:31:55.128	0
cmo8q2wna000d11b5roirykse	DN 수퍼스, 키움 DRX 완파… 셧아웃 승리로 수렴 가능성 높여	lck-match-115548128962906247	2026-04-02 10:00:00	lolesports	Esports	LCK	fixed	DN 수퍼스, 키움 DRX 완파… 셧아웃 승리로 수렴 가능성 높여	2026년 LCK 1주차, DN 수퍼스가 키움 DRX를 2:0으로 격파했다. 경기는 풀세트 접전을 벌였으나 최종 승자는 DN 수퍼스로 확정됐다.	DN 수퍼스는 2026년 4월 2일(목) 10시 경 진행된 키움 DRX와의 경매에서 2:0 완승을 거뒀다. BO3 포맷으로 진행된 이번 경기에서 DN 수퍼스는 풀세트 접전 끝 상대를 격파하며 승리를 확보했다.\n\n이번 승리로 DN 수퍼스는 전적 1승 5패에서 2승 5패로 전적을 개선했다. 반면 키움 DRX는 2승 4패 기록에서 2승 5패로 패배가 증가했다. 풀세트 접전이었음에도 불구하고 한 팀이 명확한 승리를 거두며 향후 순위 경쟁에 변수가 될 가능성을 보였다.\n\nDN 수퍼스는 본 경기를 통해 부진 탈출의 발판을 마련했다. 키움 DRX는 연전연승의 흐름을 끊고 재정비 기간을 가져야 할 상황이다. 두 팀 모두 향후 경기에서의 회복력이 중요한 순간으로 판단된다.	{LCK,"DN 수퍼스","키움 DRX","2:0 완파",셧아웃,1주차,2026시즌}	PUBLISHED	2026-04-21 14:32:01.223	2026-04-21 14:32:01.223	0
cmo8q313z000e11b5kak09ird	KT 롤스터, 젠지 격파하며 6연승 달성	lck-match-115548128962906275	2026-04-03 08:00:00	lolesports	Esports	LCK	fixed	KT 롤스터, 젠지 격파하며 6연승 달성	2026년 4월 3일 LCK 1주차 경기에서 KT 롤스터가 젠지를 2:1로 꺾고 무패 행진을 이어갔다. 풀세트 접전 끝에 얻은 승리로 6승 0패 기록을 수립했다.	KT 롤스터가 2026년 4월 3일 오전 8시 LCK 1주차 경기에서 젠지와의 풀세트 대결을 2:1로 제압했다. 이번 승리로 KT 롤스터는 개막전부터 6연승 가도를 이어가며 무패의 위상을 드러냈다.\n\n이 경기는 양 팀의 현 시즌 상황을 명확히 드러냈다. KT 롤스터는 6승 0패로 리그 선두권을 독주하며 강한 모멘텀을 유지 중이고, 젠지는 3승 3패로 승무패가 엇갈리며 팀 안정성을 모색하는 국면이다. 풀세트까지 간 접전은 양 팀 간 경쟁력이 상당함을 시사한다.\n\nKT 롤스터는 다음 경기에서도 현재의 흐름을 이어갈 수 있을지가 주목된다. 한편 젠지는 이번 패배 이후 3승 3패의 기록을 정리하며 후속 경기들에서의 회복력이 중요할 전망이다.	{LCK,"KT 롤스터",젠지,"2:1 승리","풀세트 접전",6연승}	PUBLISHED	2026-04-21 14:32:07.008	2026-04-21 14:32:07.008	0
cmpcirpou001caa8alzid6w95	Marvel Cosmic Invasion Is Adding One of My Fave Heroes Today, And a New Mode in 2026	https://www.pushsquare.com/news/2026/05/marvel-cosmic-invasion-is-adding-one-of-my-fave-heroes-today-and-a-new-mode-in-2026	2026-05-18 17:00:00	Push Square	Console	PlayStation	fixed	PlayStation, '마블 코즈믹 인베이션'에 사이클롭스 추가... 2026년 신규 모드 예정	PS5·PS4 독점 비트 액션게임 '마블 코즈믹 인베이션'이 X-Men의 사이클롭스를 새로운 플레이어블 캐릭터로 추가하며, 내년 신규 게임 모드 투입으로 장기 콘텐츠 로드맵을 확정했다.	소니 인터랙티브 엔터테인먼트(SIE)와 개발사는 PlayStation 플랫폼의 액션 게임 '마블 코즈믹 인베이션'에 마블 유니버스의 인기 캐릭터 사이클롭스를 추가한다고 공식 발표했다. 사이클롭스는 X-Men의 핵심 멤버로, 적안광선(아이 비암)을 활용한 독특한 전투 스타일로 기존 캐릭터들과는 차별화된 플레이 경험을 제공할 것으로 예상된다. 현재 PS5·PS4를 통해 서비스 중인 동 타이틀이 지속적인 캐릭터 확장으로 유저 참여도를 높이고 있다.\n\n개발사는 2026년 중 신규 게임 모드 도입을 예정하고 있어, 단순 캐릭터 추가를 넘어 근본적인 콘텐츠 다양화를 추진 중이다. 이는 PS Plus Extra·Premium 구독자들이 즉시 접근할 수 있는 콘텐츠 확대 전략의 일환으로 해석되며, PlayStation의 독점 타이틀로서 구독 서비스의 가치 강화에 기여할 것으로 보인다. 비트 액션 장르의 수익 모델이 계절 콘텐츠와 신규 모드 추가를 통해 장기화되는 추세와 맞물려 있다.\n\n마블 코즈믹 인베이션은 PS5의 고성능 GPU를 활용한 고품질 그래픽과 DualSense 컨트롤러의 햅틱 피드백 기능을 적극 활용한 작품으로, 기존 PS4 유저와의 호환성을 유지하면서도 세대 간 성능 차이를 효과적으로 표현하고 있다. 현지화된 한국어 자막 지원 여부는 공식 채널을 통해 별도 공지될 예정이며, 게임은 PS Plus 구독 서비스 포함 타이틀로 추가 구매 없이 즉시 플레이 가능하다. 사이클롭스 캐릭터는 오늘 업데이트를 통해 배포되며, 2026년 신규 모드 출시 일정은 개발진의 추가 공지를 대기해야 한다.	{"PlayStation 5","PlayStation 4","마블 코즈믹 인베이션","비트 액션","캐릭터 업데이트","PS Plus"}	PUBLISHED	2026-05-19 10:58:08.719	2026-05-19 10:58:08.719	0
cmo8q3b54000g11b5le768a36	T1, 한화생명 e스포츠 상대로 완파…셧아웃 승리	lck-match-115548128962578451	2026-04-04 08:00:00	lolesports	Esports	LCK	fixed	T1, 한화생명 e스포츠 상대로 완파…셧아웃 승리	2026년 4월 4일 LCK 1주차 경기에서 T1이 한화생명 e스포츠를 2:0으로 압도했다. 풀세트 접전 끝의 신승으로, T1은 3승 4패로 전적을 개선했다.	T1이 2026년 4월 4일(한국시간) LCK 1주차 경기에서 한화생명 e스포츠를 상대로 2:0의 완승을 거두었다. BO3 포맷의 본 경기는 풀세트 접전으로 진행됐으나, T1이 양 세트를 차례로 점령하며 셧아웃 승리를 달성했다.\n\n이번 승리로 T1은 현재 3승 4패의 전적을 기록 중이며, 한화생명 e스포츠는 5승 1패에서 5승 2패로 한 경기를 내주게 됐다. 풀세트 접전이라는 평가에도 불구하고 T1이 한 경기도 양보하지 않은 완파로 마무리한 것은 중요한 모멘텀으로 작용할 것으로 예상된다.\n\nT1은 이번 승리를 발판으로 하반기 순위 경쟁에서의 위치를 강화할 기회를 마련했다. 한화생명 e스포츠는 첫 패배에도 불구하고 여전히 상위권 위치를 유지하고 있으며, 다음 경기에서의 재기가 주목된다.	{LCK,T1,"한화생명 e스포츠","2:0 완파",셧아웃,1주차}	PUBLISHED	2026-04-21 14:32:20.009	2026-04-21 14:32:20.009	0
cmo8q3fbt000h11b5gw4m132b	디플러스 기아, 키움 DRX 완파…2:0 셧아웃	lck-match-115548128962906295	2026-04-04 10:00:00	lolesports	Esports	LCK	fixed	디플러스 기아, 키움 DRX 완파…2:0 셧아웃	2026년 4월 4일 LCK 1주차 경기에서 디플러스 기아가 키움 DRX를 2:0으로 압도하며 승리 기록을 3승으로 늘렸다.	디플러스 기아는 4일 진행된 키움 DRX와의 BO3 경기에서 2:0 완승을 거두며 승리를 수확했다. 이번 경기는 양 팀 모두 치열한 접전을 펼쳤으나, 디플러스 기아가 각 세트마다 우위를 유지하며 제압했다.\n\n이 승리로 디플러스 기아는 현재 3승 3패로 승패 기록을 균등하게 유지했다. 한편 키움 DRX는 2승 4패로 패배 기록이 늘어나며 리그 내 상위권 경쟁에서 뒤처지는 상황이 됐다. 디플러스 기아의 안정적인 경기 운영이 이번 승리의 핵심으로 작용했다.\n\n디플러스 기아는 다음 경기에서도 현재의 승리 모멘텀을 이어갈 수 있을지 주목된다. 키움 DRX는 2승 4패의 전적에서 탈출하기 위해 다음 일정에서 승수 확보가 필수적인 상황이다.	{LCK,"디플러스 기아","키움 DRX",경기결과}	PUBLISHED	2026-04-21 14:32:25.433	2026-04-21 14:32:25.433	0
cmo8q3jws000i11b53dk69pz1	농심 레드포스, DN 수퍼스 2:0 완파...1주차 선두 경쟁 주도	lck-match-115548128962906243	2026-04-05 08:00:00	lolesports	Esports	LCK	fixed	농심 레드포스, DN 수퍼스 2:0 완파...1주차 선두 경쟁 주도	2026년 4월 5일 LCK 1주차, 농심 레드포스가 DN 수퍼스를 2:0으로 셧아웃하며 4승 2패 기록을 확보했다.	농심 레드포스가 2026 LCK 1주차 경기에서 DN 수퍼스를 상대로 2:0 완승을 거두며 리그 상위권 위치를 공고히 했다. 4월 5일 오전 치러진 이 BO3 매치에서 레드포스는 풀세트 접전을 펼친 끝에 두 세트를 연속으로 제압했다.\n\n이번 승리로 농심 레드포스는 4승 2패의 전적을 기록하며 현재 득실차에서 우위를 점하고 있다. 반면 DN 수퍼스는 1승 5패로 하위권에 머물러 있으며, 리그 재정비의 필요성이 제기되는 상황이다. 레드포스의 연승 기세는 리그 초반부 승점 경합에 중요한 모멘텀을 제공할 것으로 보인다.\n\n농심 레드포스는 앞으로의 일정에서 현재의 승리 탄력을 유지해야 하는 과제를 안고 있다. DN 수퍼스는 다음 경기에서 승리를 필요로 하는 상황으로, 리그 순위 재편성을 위한 변수 역할이 예상된다.	{LCK,"농심 레드포스","DN 수퍼스","2:0 완승","2026 시즌 1주차",이스포츠}	PUBLISHED	2026-04-21 14:32:31.372	2026-04-21 14:32:31.372	0
cmo8q3otd000j11b5oudfy4s3	젠지, BNK 피어엑스 완파…1주 차 승점 경쟁 심화	lck-match-115548128962840671	2026-04-05 10:00:00	lolesports	Esports	LCK	fixed	젠지, BNK 피어엑스 완파…1주 차 승점 경쟁 심화	2026년 4월 5일 LCK 1주 차 경기에서 젠지가 BNK 피어엑스를 2:0으로 완파했다. 젠지는 3승 3패로 전적을 동점화했으며, BNK 피어엑스는 2승 4패로 하강세를 이어갔다.	젠지는 4월 5일 진행된 BNK 피어엑스와의 경기에서 2:0 완승을 거두며 5경기 만에 승리를 확보했다. 이번 경기는 풀세트 접전으로 치러졌으나, 젠지가 두 세트 모두 확보하는 셧아웃으로 마무리됐다. 최종 스코어는 2:0이며, 젠지의 전적은 3승 3패로 기록됐다.\n\n이번 승리로 젠지는 현재 3:3의 동점 전적을 유지하며 중위권 경쟁에 복귀했다. 반면 BNK 피어엑스는 2승 4패로 떨어져 하강세를 지속하고 있다. 양 팀 모두 중요한 승점 경쟁이 진행되는 시점에서 승패 결과는 향후 순위 변동에 영향을 미칠 것으로 보인다.\n\n1주 차 경기가 진행되는 가운데 양 팀의 다음 매치업은 리그 전체 판도에 미치는 파급력이 증대될 것으로 예상된다. 젠지의 연승 추세 지속 여부와 BNK 피어엑스의 전열 재정비가 향후 주목할 사항이 될 것으로 확인됐다.	{LCK,젠지,BNK피어엑스,2:0완파,1주차}	PUBLISHED	2026-04-21 14:32:37.729	2026-04-21 14:32:37.729	0
cmo8q3srj000k11b5y9w8q791	한화생능 e스포츠, 디플러스 기아 완파…2주차 승승장구	lck-match-115548128962840615	2026-04-08 08:00:00	lolesports	Esports	LCK	fixed	한화생능 e스포츠, 디플러스 기아 완파…2주차 승승장구	2026년 4월 8일 LCK 2주차에서 한화생명 e스포츠가 디플러스 기아를 2:0으로 셧아웃. 한화생명은 5승 1패로 상승세를 이어가는 반면, 디플러스 기아는 3승 3패로 중원대의 자리를 유지 중.	한화생명 e스포츠가 4월 8일 LCK 2주차 경기에서 디플러스 기아를 2:0으로 완파했다. 양 팀의 접전 끝에 한화생명이 두 세트를 연속으로 빼앗으며 BO3 승리를 거머쥐었다.\n\n이 승리로 한화생명 e스포츠는 5승 1패의 전적을 기록하며 리그 상단부 자리를 굳혀가고 있다. 반면 디플러스 기아는 3승 3패로 리그 중원대의 위치에 머물면서 향후 경기 결과에 따라 순위 변동이 예상된다.\n\n한화생명 e스포츠는 다음 주차 일정을 통해 상위권 입지를 더욱 공고히 할 필요가 있으며, 디플러스 기아는 연승 기회를 통한 반등의 기회를 노려야 하는 상황이다.	{LCK,"한화생명 e스포츠","디플러스 기아","2:0 완파",2주차}	PUBLISHED	2026-04-21 14:32:42.847	2026-04-21 14:32:42.847	0
cmpcitwpr001laa8axtgiqogw	Feature: 25+ PS5, PS4 Games to Buy in PS Store's Next Level Savings Sale (North America/Europe)	https://www.pushsquare.com/features/25plus-ps5-ps4-games-to-buy-in-ps-stores-next-level-savings-sale-north-americaeurope	2026-05-18 09:00:00	Push Square	Console	PlayStation	fixed	PlayStation Store 'Next Level Savings' 세일 개최... PS5·PS4 게임 25종 이상 할인	PlayStation Store의 대규모 할인 이벤트 'Next Level Savings'가 5월 27일까지 진행 중이며, PS5·PS4 게임 수천 종이 참여해 국내 유저들의 라이브러리 확충 기회가 열렸다.	PlayStation Store에서 대규모 할인 행사 'Next Level Savings'를 개최했다. 북미·유럽 지역을 중심으로 진행되는 이번 세일은 5월 27일까지 진행되며, PS5와 PS4 플랫폼 양쪽 모두에서 수천 종의 게임이 할인 대상으로 포함돼 있다. 최근 예상치 못한 공백 이후 개최되는 이번 세일은 PlayStation 유저들이 큐레이션된 타이틀들을 저렴한 가격에 확보할 수 있는 황금 기회가 될 것으로 보인다.\n\n이번 세일에는 AAA급 대작부터 인디 게임까지 폭넓은 장르와 가격대의 타이틀들이 포함돼 있다. PlayStation Plus 구독자들은 추가 할인 혜택을 받을 수 있으며, 특히 PS5 독점작이나 차세대 최적화 타이틀들이 상당한 폭의 가격 인하를 받고 있다. 세일 기간 동안 단일 게임당 평균 20~50% 범위의 할인이 적용되고 있으며, 인기 타이틀의 경우 70% 이상 할인되는 경우도 있다.\n\nSony가 정기적인 세일 이벤트를 통해 PlayStation 플랫폼의 라이브러리 확충을 장려하는 것은 PlayStation Plus 가입자 기반 확대 전략의 일환으로 풀이된다. 특히 PS5 세대의 게임 가격이 70달러(약 9만 원)대로 상향화된 상황에서, 이러한 할인 이벤트는 신규 유저의 진입장벽을 낮추고 기존 유저의 재구매를 유도하는 마케팅 도구로 기능하고 있다.\n\n**국내 유저 가이드**: 이번 세일은 북미·유럽 PlayStation Store를 중심으로 진행 중이며, 국내 정식 PlayStation Store에서는 별도의 할인 일정이 공지되지 않았다. 해외 계정을 통한 구매를 검토 중인 유저는 각 지역의 정가 정책과 환율을 고려해 구매 결정을 내릴 것을 권장한다. 구체적인 할인 대상 게임 목록과 각 타이틀의 할인율은 공식 PlayStation Store 웹사이트 및 콘솔 내 스토어 메뉴에서 확인할 수 있다.	{PlayStation,"PlayStation Store","세일 이벤트","게임 할인"}	PUBLISHED	2026-05-19 10:59:51.134	2026-05-19 10:59:51.134	0
cmo8q3xnp000l11b5kttr0y12	젠지, T1 완파…2:0 셧아웃으로 동점 다툼 '신승'	lck-match-115548128962840643	2026-04-08 10:00:00	lolesports	Esports	LCK	fixed	젠지, T1 완파…2:0 셧아웃으로 동점 다툼 '신승'	2026년 4월 8일 LCK 2주 차 경기에서 젠지가 T1을 상대로 2:0 완승을 거두며 3승 3패 동률을 유지했다.	젠지는 8일 서울 스타디움에서 진행된 T1과의 BO3 매치에서 2:0으로 압도하며 셧아웃 승리를 확정했다. 현재 양 팀 모두 3승 3패로 동일한 전적을 기록하고 있으며, 이번 경기는 리그 상위권 경쟁에서 중요한 변수로 작용할 것으로 보인다.\n\n리그 중반부에 접어든 가운데 젠지의 이번 완파는 팀의 안정성을 입증하는 결과다. T1 역시 동률 전적을 유지하면서 하위권 탈출을 위한 연승의 기회를 재조정해야 할 상황이 도래했다. 양 팀 모두 남은 경기에서의 성적이 플레이오프 진출을 좌우할 것으로 예상된다.\n\n젠지는 다음 경기에서 상위권 팀들과의 대전을 앞두고 있으며, 이번 승리의 모멘텀을 이어갈 수 있을지가 주목된다. T1은 패배를 만회하기 위해 전술 재정비와 팀 컨디션 조율에 집중할 필요가 있을 것으로 분석된다.	{LCK,젠지,T1,2:0완패,2026시즌,이스포츠,LoL}	PUBLISHED	2026-04-21 14:32:49.189	2026-04-21 14:32:49.189	0
cmo8q47dm000n11b5tvenannl	KT 롤스터, 농심 레드포스 완파…무패 행진 지속	lck-match-115548128962906299	2026-04-09 10:00:00	lolesports	Esports	LCK	fixed	KT 롤스터, 농심 레드포스 완파…무패 행진 지속	9일 오전 10시 LCK 2주 차 경기에서 KT 롤스터가 농심 레드포스를 2:0으로 셧아웃, 6승 무패 기록을 유지했다.	KT 롤스터가 9일 LCK 2주 차 경기에서 농심 레드포스를 상대로 2:0 완승을 거두며 무패 행진을 이어갔다. 이날 경기는 양 팀 모두 세트마다 팽팽한 접전을 벌였음에도 불구하고, KT 롤스터가 두 세트 모두 승리하며 완파의 기록을 확정했다.\n\nKT 롤스터는 이번 승리로 6승 무패의 완벽한 전적을 유지하며 리그 선두 자리를 공고히 했다. 반면 농심 레드포스는 4승 2패로 기록되며 중상위권 포지션을 유지했으나, 상위 팀과의 격차를 더 벌리게 됐다.\n\nKT 롤스터는 현재의 우위를 바탕으로 다음 경기에서도 자신의 위치 확보를 목표로 할 것으로 보인다. 한편 농심 레드포스는 추가 패배를 방지하고 상위권 팀들과의 격차를 좁히기 위해 체계적인 개선이 필요한 상황이다.	{LCK,"KT 롤스터","농심 레드포스","2:0 셧아웃","2주 차",이스포츠}	PUBLISHED	2026-04-21 14:33:01.786	2026-04-21 14:33:01.786	0
cmo8q4d2g000o11b5rv16wp4p	T1, DN 수퍼스 완파…2:0 셧아웃 승리로 중위권 탈출	lck-match-115548128962840635	2026-04-10 08:00:00	lolesports	Esports	LCK	fixed	T1, DN 수퍼스 완파…2:0 셧아웃 승리로 중위권 탈출	2026년 4월 10일 LCK 2주 차 경기에서 T1이 DN 수퍼스를 2:0으로 완파했다. T1은 3승 4패에서 4승 3패로 승수를 늘렸으며, DN 수퍼스는 1승 6패로 하위권에 머물렀다.	T1이 4월 10일 LCK 2주 차 경기에서 DN 수퍼스를 상대로 2:0 완승을 거두었다. 풀세트 접전으로 기록된 이번 경기에서 T1은 두 세트 모두를 가져가며 확실한 승리를 확정지었다.\n\nT1은 이 승리로 통산 성적을 4승 3패로 올렸으며, 리그 중위권으로의 탈출을 알렸다. DN 수퍼스는 1승 6패로 현재 하위권 순위에 머물고 있으며, 초반 리그전에서 상승세를 이어가지 못한 상황이다.\n\nT1의 다음 경기는 리그 전체 판도에서 중요한 위치를 차지할 것으로 보인다. DN 수퍼스는 남은 경기에서 승점 확보를 통한 순위 반등이 필수적인 상황으로, 하위권 경쟁이 심화될 것으로 예상된다.	{LCK,T1,DN수퍼스,"2:0 완파",2주차,이스포츠}	PUBLISHED	2026-04-21 14:33:09.16	2026-04-21 14:33:09.16	0
cmo8q4hqc000p11b5vsxo275z	한화생명 e스포츠, BNK 피어엑스 상대 풀세트 접전 끝 신승	lck-match-115548128962840599	2026-04-10 10:00:00	lolesports	Esports	LCK	fixed	한화생명 e스포츠, BNK 피어엑스 상대 풀세트 접전 끝 신승	2026년 4월 10일 LCK 2주 차 경기에서 한화생명 e스포츠가 BNK 피어엑스를 2:1로 꺾고 5승 1패 상위권 순위를 유지했다.	한화생명 e스포츠는 10일 LCK 2주 차 경기에서 BNK 피어엑스와 벌인 BO3 매치를 2:1로 제압했다. 양 팀이 주고받은 풀세트 접전 끝에 한화생명 e스포츠가 최종 승리를 거머쥐며 상대를 꺾은 것으로 확인됐다.\n\n이번 승리로 한화생력 e스포츠는 5승 1패의 전적을 기록하며 리그 상위권 순위를 굳히는 데 성공했다. 한편 BNK 피어엑스는 2승 4패로 현재 리그 하위권에 위치하고 있으며, 향후 연승을 통한 순위 상승이 과제가 될 것으로 보인다.\n\n한화생명 e스포츠의 이번 신승은 리그 초반 팀의 안정적인 경쟁력을 입증하는 한편, 풀세트 접전을 거쳐 얻은 만큼 향후 상위 팀과의 경쟁에서도 심리적 자산으로 작용할 전망이다. 한편 BNK 피어엑스는 조직력 강화와 경기 운영 개선을 통해 리그 중반 이후의 반전을 노려야 할 시점이다.	{LCK,"한화생명 e스포츠","BNK 피어엑스",2주차,경기결과,이스포츠}	PUBLISHED	2026-04-21 14:33:15.204	2026-04-21 14:33:15.204	0
cmo8q4mh2000q11b5cjbomgx6	키움 DRX, 농심 레드포스 완파…셧아웃으로 연승 탄력	lck-match-115548128962906307	2026-04-11 08:00:00	lolesports	Esports	LCK	fixed	키움 DRX, 농심 레드포스 완파…셧아웃으로 연승 탄력	2026년 LCK 2주 차, 키움 DRX가 농심 레드포스를 2:0으로 압도했다. 경기는 4월 11일 오전 진행됐으며, 키움 DRX는 2승 4패에서 3승 4패로 순위 상승을 기록했다.	키움 DRX가 4월 11일 오전 LCK 2주 차 경기에서 농심 레드포스를 2:0 완파하며 셧아웃 승리를 거두었다. BO3 형식으로 진행된 이번 경기에서 키움 DRX는 풀세트 접전 끝에 상대를 제압했다. 최종 스코어는 2:0으로 확인됐다.\n\n이번 승리로 키움 DRX는 전적을 2승 4패에서 3승 4패로 개선해 순위 상승의 계기를 마련했다. 반면 농심 레드포스는 4승 2패의 상위권 기록을 유지하고 있으나, 이번 패배로 득실차 관리가 필요한 상황이 됐다. 키움 DRX의 이번 셧아웃 승리는 침체기에서 벗어나는 신호탄으로 평가된다.\n\n리그 전반적으로 상위권 팀들의 경쟁이 심화되고 있는 가운데, 키움 DRX의 다음 경기 결과가 하위권 순위 재편에 영향을 미칠 것으로 예상된다. 농심 레드포스는 패배 이후 안정적인 경기력 회복이 과제로 남았다.	{LCK,키움DRX,농심레드포스,2주차,셧아웃,2:0}	PUBLISHED	2026-04-21 14:33:21.351	2026-04-21 14:33:21.351	0
cmo8q4s5t000r11b51x0zeems	디플러스 기아, 젠지 2:0 완파…동점 상황서 승점 탈탈	lck-match-115548128962906271	2026-04-11 10:00:00	lolesports	Esports	LCK	fixed	디플러스 기아, 젠지 2:0 완파…동점 상황서 승점 탈탈	2026년 4월 11일 LCK 2주 차 경기에서 디플러스 기아가 젠지를 2:0으로 제압. 양팀 모두 3승 3패 동점 상황에서 치러진 본 경기는 접전 끝 디플러스 기아의 완승으로 마무리됐다.	디플러스 기아가 11일 오전 10시(한국시각) 진행된 LCK 2주 차 경기에서 젠지를 상대로 2:0의 완파승을 거두며 순위 경쟁에서 우위를 확보했다. 경기 시작 전 양팀은 각각 3승 3패로 동점을 기록하고 있었다.\n\n이번 승리로 디플러스 기아는 4승 3패로 기록을 개선하며 젠지(3승 4패)와의 직접 대면에서 우위를 차지했다. 풀세트 접전으로 평가받는 이번 매치는 양팀이 모두 최고의 경기력을 발휘했음을 시사하며, 디플러스 기아의 집중력 있는 게임 운영이 승리의 열쇠가 된 것으로 분석된다.\n\n디플러스 기아는 이어지는 경기에서의 연승 흐름 유지가 관건인 반면, 젠지는 연패 기록을 막기 위한 재정비가 시급한 상황이다. 양팀의 향후 경기 결과는 LCK 중원대 팀들의 순위 판도 재편에 직결될 것으로 예상된다.	{LCK,"디플러스 기아",젠지,BO3,2주차,완파}	PUBLISHED	2026-04-21 14:33:28.721	2026-04-21 14:33:28.721	0
cmo8q4w15000s11b5ai6dm3u0	BNK 피어엑스, DN 수퍼스 2:0 완파…2주 차 중원 장악	lck-match-115548128962840663	2026-04-12 08:00:00	lolesports	Esports	LCK	fixed	BNK 피어엑스, DN 수퍼스 2:0 완파…2주 차 중원 장악	2026년 4월 12일 LCK 2주 차 경기에서 BNK 피어엑스가 DN 수퍼스를 2:0으로 제압했다. 현재 BNK는 2승 4패, DN은 1승 5패로 기록했다.	BNK 피어엑스는 12일 오전 LCK 2주 차 경기에서 DN 수퍼스와의 BO3 매치업을 2:0으로 마무리했다. 풀세트 접전이 예상됐던 대진이었으나, BNK가 양 세트를 연속으로 장악하며 승리를 확정지었다.\n\n이번 승리로 BNK 피어엑스는 2승 4패의 전적을 기록하며 리그 중원 확보에 나섰다. 반면 DN 수퍼스는 1승 5패로 리그 하위권에 머물게 됐으며, 연승이 필수적인 상황으로 분석된다.\n\n2주 차 경기 일정이 진행 중인 가운데, BNK의 이번 2:0 완승은 팀의 안정성을 입증하는 결과로 평가된다. 앞으로의 경기 운영과 순위 변동이 주목된다.	{LCK,BNK피어엑스,DN수퍼스,2:0완승}	PUBLISHED	2026-04-21 14:33:33.737	2026-04-21 14:33:33.737	0
cmo8q50dq000t11b5vqulzd9e	KT 롤스터, 한진 브리온 2:0 완파…완벽한 6연승 질주	lck-match-115548128962906259	2026-04-12 10:00:00	lolesports	Esports	LCK	fixed	KT 롤스터, 한진 브리온 2:0 완파…완벽한 6연승 질주	2026년 4월 12일 LCK 2주 차 경기에서 KT 롤스터가 한진 브리온을 2:0으로 셧아웃, 6승 무패 행진을 이어갔다.	KT 롤스터가 12일 오전 10시(KST) 진행된 LCK 2주 차 경기에서 한진 브리온을 상대로 2:0의 완승을 거두며 불패 행진을 이어갔다. BO3 형식으로 진행된 이번 경기에서 KT 롤스터는 두 세트 모두 확실한 격차를 벌리며 압도적인 승리를 거머쥐었다.\n\nKT 롤스터는 이번 승리로 6승 무패의 완벽한 전적을 기록하며 현재 리그 최상위권 위치를 확고히 했다. 한편 한진 브리온은 1승 5패로 현재까지 리그 내 최악의 전적을 기록 중이며, 조기 탈락이 우려되는 상황에 처했다.\n\nKT 롤스터는 리그 초반 강력한 모습을 유지하고 있으며, 향후 상위권 팀들과의 직접 대결이 예정되어 있다. 한진 브리온은 현 상황을 타개하기 위해 다음 경기부터 신속한 체질 개선이 절실한 것으로 보인다.	{LCK,"KT 롤스터","한진 브리온","2:0 완파",6연승,"2026 LCK"}	PUBLISHED	2026-04-21 14:33:39.374	2026-04-21 14:33:39.374	0
cmo8q54t0000u11b5rknixemz	농심 레드포스, BNK 피어엑스 완파…3주 차 상승세 지속	lck-match-115548128962906219	2026-04-15 08:00:00	lolesports	Esports	LCK	fixed	농심 레드포스, BNK 피어엑스 완파…3주 차 상승세 지속	2026년 4월 15일 LCK 3주 차, 농심 레드포스가 BNK 피어엑스를 2:0으로 셧아웃하며 4승 2패 기록을 달성했다.	농심 레드포스가 4월 15일 진행된 LCK 3주 차 경기에서 BNK 피어엑스를 2:0으로 격파했다. 풀세트 접전 끝에 승리를 확보한 레드포스는 현재 4승 2패로 리그 중상위권 순위를 유지 중이다.\n\n이번 승리로 레드포스는 연승의 모멘텀을 이어가며 안정적인 리그 활동을 입증했다. 반면 피어엑스는 2승 4패의 저점에서 벗어나지 못하고 있으며, 후속 경기에서의 승점 확보가 절실한 상황이다.\n\n3주 차가 진행 중인 가운데 양팀 모두 남은 일정에서의 경기력 회복이 중요한 과제로 지목된다. 특히 피어엑스는 승률 개선을 위해 가시적인 전술 변화와 팀 운영 개선이 요구되는 시점이다.	{LCK,"농심 레드포스","BNK 피어엑스","2:0 완파","3주 차",이스포츠}	PUBLISHED	2026-04-21 14:33:45.108	2026-04-21 14:33:45.108	0
cmpciu57z001maa8a7xiceokq	Mixtape Isn't Going Anywhere, Won't Be Delisted Over Music Licenses	https://www.pushsquare.com/news/2026/05/mixtape-isnt-going-anywhere-wont-be-delisted-over-music-licenses	2026-05-18 01:00:00	Push Square	Console	PlayStation	fixed	PlayStation 5 독점작 '믹스테이프', 영구 음악 라이선스 확보로 향후 서비스 중단 걱정 없어	PS5 인디 명작 '믹스테이프'가 영구적 음악 라이선스를 확보함으로써 라이선스 만료에 따른 스토어 삭제 우려를 완전히 해소했으며, 이는 음악 저작권 이슈로 고민하는 다른 게임사들의 선례가 될 전망이다.	플레이스테이션 5의 인디 명작 '믹스테이프'(Mixtape)가 영구적(perpetuity) 음악 라이선스 계약을 체결함으로써 향후 스토어 삭제 위험으로부터 완전히 해방됐다. 개발사 베토벤 앤 다이노소어(Beethoven & Dinosaur)와 퍼블리셔 안나푸르나 인터랙티브(Annapurna Interactive)가 공식 확인한 이번 조치는 게임 산업에서 음악 저작권 이슈가 얼마나 심각한지를 여실히 드러낸다.\n\n창의 감독 조니 갈바트론은 외신 코타쿠와의 인터뷰에서 "영구 라이선스 확보를 위해 추가 비용을 투자했다"고 밝혔다. 기존 게임들이 음악 저작권 만료에 따라 강제 삭제되거나 트랙이 변경되는 사례(예: 샌드박스 게임의 인게임 음악 라이선스 만료)와 달리, 믹스테이프는 게임의 정체성을 좌우하는 OST 전곡에 대한 영구적 권리를 법적으로 보장받게 된 것이다. 안나푸르나 인터랙티브도 공식 소셜 미디어를 통해 이를 재확인했다.\n\n이번 결정은 소니의 플레이스테이션 플랫폼 전략에 긍정적 신호를 보낸다. PS Plus 카탈로그나 스토어 지속성 측면에서 '음악 라이선스'는 장기 유지보수가 필요한 게임의 최대 약점이었다. 믹스테이프 같은 인디 타이틀이 높은 추가 비용을 감수하면서까지 영구 라이선스를 확보한다는 것은 게임의 문화적·상업적 가치가 그만큼 크다는 의미이며, 향후 음악이 핵심인 다른 인디 게임 개발사들의 벤치마크 사례가 될 수 있다.\n\n**국내 유저 가이드**\n- **출시 플랫폼**: PlayStation 5 독점\n- **한국어 지원**: 한국어 자막 및 음성 지원 확인됨\n- **정식 출시 가격**: 약 2만 9천 원대 (스토어 기준)\n- **구매처**: PlayStation Store 한국 스토어\n- **라이선스 안정성**: 영구 계약 체결로 향후 스토어 삭제 우려 전무	{"PlayStation 5",믹스테이프,인디게임,"음악 라이선스","서비스 지속성"}	PUBLISHED	2026-05-19 11:00:02.159	2026-05-19 11:00:02.159	0
cmo8q59dv000v11b50nidl50p	KT 롤스터, DK와 풀세트 접전 끝 신승…무패 행진 지속	lck-match-115548128962906287	2026-04-15 10:00:00	lolesports	Esports	LCK	fixed	KT 롤스터, DK와 풀세트 접전 끝 신승…무패 행진 지속	15일 3주차 LCK 경기에서 KT 롤스터가 디플러스 기아를 2:1로 꺾고 6승 무패 행진을 이어갔다. 풀세트 접전으로 확인됐다.	KT 롤스터가 디플러스 기아와의 3주차 대결에서 2:1의 풀세트 접전을 제압했다. 15일 오전 10시(UTC 기준) 진행된 이 경기에서 KT는 세 세트 중 두 세트를 차지하며 승리를 거머쥔 것으로 확인됐다.\n\nKT 롤스터는 이번 승리로 6승 무패의 완벽한 전적을 기록했다. 반면 DK는 3승 3패로 리그 중위권 순위에 머물게 됐다. 풀세트 접전의 승리는 양 팀 모두 고도의 집중력을 발휘한 경기였음을 의미하며, KT의 안정적인 게임 운영과 의지가 결정적인 역할을 한 것으로 분석된다.\n\nKT 롤스터는 무패 행진을 이어가며 현재 리그 최강자로서의 입지를 공고히 했다. 다음 경기에서도 상위권 팀과의 대결이 예상되는 만큼, 현재의 기세를 유지할 수 있을지에 팬들과 관계자들의 이목이 쏠려 있다.	{LCK,"KT 롤스터","디플러스 기아",2:1,풀세트}	PUBLISHED	2026-04-21 14:33:51.043	2026-04-21 14:33:51.043	0
cmo8q5e7c000w11b5z7l3746f	젠지, 한진 브리온 완파…3주차 승리로 상향세	lck-match-115548128962906251	2026-04-16 08:00:00	lolesports	Esports	LCK	fixed	젠지, 한진 브리온 완파…3주차 승리로 상향세	LCK 3주차 경기에서 젠지가 한진 브리온을 2:0으로 셧아웃. 젠지는 3승 3패로 승점을 올렸으며, 한진 브리온은 1승 5패로 기록됐다.	젠지가 16일 진행된 LCK 3주차 경기에서 한진 브리온을 상대로 2:0의 완승을 거두었다. 이번 경기는 풀세트 접전 끝에 젠지가 두 세트 모두 승리하며 상대의 저항을 꺾었다.\n\n이 승리로 젠지는 3승 3패의 동률 전적을 기록하며 리그 중원대로 진입했다. 한편 한진 브리온은 1승 5패로 현재 하위권 순위에 머물고 있으며 추가 승점 확보가 시급한 상황이다.\n\n젠지는 이번 승리를 발판으로 후속 경기에서의 추가 상승을 노려야 할 시점이다. 한진 브리온은 남은 경기에서의 흐름 전환이 필수적인 상황으로 판단된다.	{LCK,젠지,한진브리온,"2:0 완패",3주차}	PUBLISHED	2026-04-21 14:33:57.289	2026-04-21 14:33:57.289	0
cmo8q5imu000x11b565hctdra	한화생명, DN 수퍼스 완파…3주 차 연승 가도	lck-match-115548128962840603	2026-04-16 10:00:00	lolesports	Esports	LCK	fixed	한화생명, DN 수퍼스 완파…3주 차 연승 가도	2026년 4월 16일 LCK 3주 차 경기에서 한화생명 e스포츠가 DN 수퍼스를 2:0으로 셧아웃, 5승 1패로 리그 상위권을 유지했다.	한화생명 e스포츠가 16일 DN 수퍼스와의 경기에서 2:0의 완승을 거두었다. 이번 경기는 LCK 3주 차에 진행된 BO3 매치로, 한화생명이 세트를 나누지 않고 상대를 제압했다.\n\n승리로 한화생명 e스포츠는 현재 5승 1패의 전적으로 리그 상위권을 확보했다. 반면 DN 수퍼스는 이 경기 패배로 1승 5패에 그치며 리그 내 침체 국면에 있는 것으로 확인됐다. 한화생명의 이번 승리는 안정적인 경기력을 바탕으로 한 연승 기록으로 평가된다.\n\n이번 경기 결과는 양 팀의 리그 위상 차이를 명확히 드러냈다. 한화생명은 다음 경기를 앞두고 상위권 자리를 굳건히 하는 계기가 될 것으로 보이며, DN 수퍼스는 전력 재정비를 통해 승리 방정식을 찾아야 할 시점에 놓여 있다.	{LCK,"한화생명 e스포츠","DN 수퍼스","2:0 셧아웃","3주 차"}	PUBLISHED	2026-04-21 14:34:03.03	2026-04-21 14:34:03.03	0
cmo8q5sqs000z11b5iezofdnb	디플러스 기아, T1 2:1 역전승···3주차 접전 제압	lck-match-115548128962840647	2026-04-17 10:00:00	lolesports	Esports	LCK	fixed	디플러스 기아, T1 2:1 역전승···3주차 접전 제압	2026년 4월 17일 LCK 3주차 경기에서 디플러스 기아가 T1을 2:1의 풀세트 접전 끝에 격파했다. 양 팀 모두 3승 3패로 동점 상황에서의 승부였다.	디플러스 기아가 17일 T1과의 3주차 경기에서 2:1의 접전 끝 신승을 거두었다. BO3 포맷으로 진행된 이날 경기는 최종 세트까지 진출한 접전이었으며, 디플러스 기아가 결정 세트를 제압하며 승리를 확정했다.\n\n이번 승리로 디플러스 기아는 전적을 4승 3패로 올리며 순위 상승의 발판을 마련했다. T1은 3승 4패로 기록이 조정되며, 최근 리그 경쟁 구도에서 미묘한 변화가 생겼다. 양 팀 모두 상위권 경쟁이 치열한 가운데 펼쳐진 이번 경기는 후속 경기 결과에 따라 순위 변동에 영향을 미칠 것으로 보인다.\n\n디플러스 기아는 이번 승리를 발판삼아 상승세를 이어갈 수 있을지, T1은 어떻게 균형을 회복할지가 리그 중반 이후의 주요 포인트가 될 전망이다.	{LCK,"디플러스 기아",T1,"풀세트 접전","2:1 승리"}	PUBLISHED	2026-04-21 14:34:16.132	2026-04-21 14:34:16.132	0
cmpciuf6c001naa8a7dtiths6	Until Dawn Dev Still Going with Dark Pictures Series, Next Entry Teased	https://www.pushsquare.com/news/2026/05/until-dawn-dev-still-going-with-dark-pictures-series-next-entry-teased	2026-05-18 00:00:00	Push Square	Console	PlayStation	fixed	PlayStation 독점 공포 어드벤처 'Dark Pictures Anthology', 차기작 'The Craven Man' 티저 영상으로 정식 공개	Supermassive Games가 PS5 플랫폼에서 운영 중인 'Dark Pictures Anthology' 시리즈의 다음 작품이 'Directive 8020' 내 숨겨진 티저 영상으로 공개됐으며, 초자연 공포물로 예상되는 신작이 일본 공포영화 '더 링'의 분위기를 담아낼 것으로 보인다.	Supermassive Games가 운영하는 'Dark Pictures Anthology' 공포 게임 시리즈의 차기작이 공식 발표 없이 전 작품의 이스터 에그 방식으로 공개됐다. 최신 시리즈작 'Directive 8020'에 숨겨진 비밀 티저 영상에서 'The Craven Man'으로 불리는 신작의 존재가 드러났으며, 영상 속 낡은 비디오테이프가 TV 화면에 재생되는 연출은 일본 공포영화 '더 링'을 연상케 한다. 이는 기존 몬스터 중심의 공포 스토리에서 벗어나 초자연 현상에 중점을 두는 방향 전환을 시사하고 있다.\n\n공개된 티저 영상의 영상미와 편집 방식으로 보아 PS5의 고사양을 충분히 활용한 차세대 공포 체험을 기대할 수 있을 것으로 보인다. 'Dark Pictures Anthology'는 2019년 'Man of Medan' 출시 이래 'Little Hope'(2021), 'House of Ashes'(2021), 'The Devil in Me'(2023), 'Directive 8020'(2024) 등 4개 작품을 PlayStation 플랫폼에 독점 공급해 왔으며, 각 작품마다 멀티플레이 협력 모드와 싱글 캠페인을 통해 다양한 이야기 분기를 제공한다. 신작 역시 이 같은 포맷을 유지할 가능성이 높다.\n\nSupermassive Games는 'Until Dawn'의 성공 이후 'Dark Pictures Anthology'를 PlayStation만의 시그니처 호러 프랜차이즈로 육성해 왔다. 이번 'The Craven Man'의 공개는 소니가 독점 IP 강화에 적극적임을 보여주는 사례이며, 향후 PS Plus Extra/Premium 가입자들이 일정 기간 후 구독 서비스를 통해 플레이할 가능성도 배제할 수 없다. 초자연 공포라는 새로운 테마는 기존 팬층을 만족시키면서도 광범위한 공포 장르 팬들을 확보하기 위한 전략적 선택으로 해석된다.\n\n'The Craven Man'은 아직 공식 출시일, 구체적인 가격, 한국어 자막 지원 여부가 발표되지 않았으며, 'Directive 8020' 내 숨겨진 이스터 에그 방식의 공개로 인해 정식 공개 시점은 미정 상태다. 기존 'Dark Pictures Anthology' 작품들이 PS5에서 정식 발매가 77,000원대(스탠다드 에디션)에 책정됐으며 한국어 자막을 지원한 점을 감안하면, 신작도 유사한 가격대와 한글화가 이루어질 것으로 예상된다. PlayStation 공식 발표를 통한 추가 정보 공개를 기다려야 한다.	{"PlayStation 5","Dark Pictures Anthology","The Craven Man",독점작,"공포 어드벤처","Supermassive Games"}	PUBLISHED	2026-05-19 11:00:15.06	2026-05-19 11:00:15.06	0
cmpciuns9001oaa8aqdck53ng	'Looks Like We Got Sucker Punched': Ghost of Yotei Fans Gutted Support Has Ended for Free Co-Op Mode	https://www.pushsquare.com/news/2026/05/looks-like-we-got-sucker-punched-ghost-of-yotei-fans-gutted-support-has-ended-for-free-co-op-mode	2026-05-17 15:00:00	Push Square	Console	PlayStation	fixed	PlayStation 5 독점작 '고스트 오브 요테이', 무료 협력 모드 'Legends' 지원 종료... 커뮤니티 '배신감' 표출	Sucker Punch가 '고스트 오브 요테이' 출시 2개월 만에 무료 협력 모드 'Legends'의 콘텐츠 업데이트를 중단하기로 결정, 국내 PS5 유저들 사이에서 아쉬움이 커지고 있습니다.	Sucker Punch Productions는 PlayStation 5 독점작 '고스트 오브 요테이'의 무료 협력 모드인 'Legends' 지원을 종료한다고 공식 발표했습니다. 지난 3월 10일 공개된 이 모드는 본편 이후 추가 스토리와 멀티플레이 콘텐츠를 제공하며 호평을 받아왔으나, 단 2개월 만에 신규 콘텐츠 추가가 중단되기로 결정된 것입니다. 커뮤니티에서는 "Sucker Punch에게 당했다(Sucker Punched)"는 표현으로 개발사의 결정을 비판하고 있습니다.\n\nLegends 모드는 본편의 구마 시대 설정에서 벗어나 다양한 무술가 캐릭터로 플레이 가능한 파밍 콘텐츠로, 무료 업데이트임에도 높은 완성도로 평가받았습니다. 다만 Sucker Punch는 신규 미션, 보상 아이템, 협력 이벤트 등 정기적 콘텐츠 로드맵을 제시하지 않은 채 지원 종료를 공표했으며, 이는 당초 플레이어들의 기대치와 명확한 괴리를 드러냈습니다.\n\nSucker Punch의 결정은 PlayStation 5 독점작의 장기 지원 전략 방향성을 보여주는 사례로 해석됩니다. 본편 판매 모멘텀 확보 후 개발 자원을 신작으로 재배치하는 중형 개발사의 현실적 선택이지만, 무료 협력 모드라는 명목으로 커뮤니티 기대감을 형성한 이상 보다 투명한 로드맵 제시가 필요했다는 지적이 제기되고 있습니다. PS Plus Extra/Premium 구독자라면 본편에 이미 접근 가능한 만큼, 이번 결정이 구독 서비스의 추가 가치 제공 전략과도 맞닿아 있습니다.\n\n【한국 유저 가이드】\n- 게임명: 고스트 오브 요테이 (Ghost of Yotei)\n- 플랫폼: PlayStation 5 독점\n- 한국어 자막: 완벽 지원 (음성은 일본어 기본)\n- 정식 출시 가격: 89,800원 (표준 에디션)\n- 구입 경로: PlayStation Store, 오프라인 유통점\n- Legends 모드: 현재까지 무료 업데이트로 이용 가능하나, 향후 신규 콘텐츠 추가 예정 없음을 확인하시기 바랍니다.	{"PlayStation 5","고스트 오브 요테이","협력 모드","게임 지원 정책"}	PUBLISHED	2026-05-19 11:00:26.217	2026-05-19 11:00:26.217	0
cmo8q66nf001211b5nffbjuxc	농심 레드포스, 한진 브리온 꺾고 풀세트 접전 제압	lck-match-115548128962906263	2026-04-19 08:00:00	lolesports	Esports	LCK	fixed	농심 레드포스, 한진 브리온 꺾고 풀세트 접전 제압	4월 19일 3주 차 경기에서 농심 레드포스가 한진 브리온을 2:1로 격침. 풀세트 접전 끝 신승을 거두며 4승 2패로 상승.	농심 레드포스가 19일 오전 한진 브리온과의 LCK 3주 차 경기에서 2:1의 풀세트 접전을 제압했다. 이번 승리로 농심 레드포스는 4승 2패 전적을 기록하며 리그 중원대 포지션을 확보했다.\n\n이번 경기는 세 세트가 모두 팽팽한 경합으로 진행된 접전이었다. 농심 레드포스는 초중반 주도권을 확보하지 못한 가운데서도 후반부 집중력으로 역전승을 거뒀으며, 이는 팀의 저력을 입증하는 결과로 평가된다. 한편 한진 브리온은 1승 5패로 리그 하위권에 머물면서 반등의 기회를 놓쳤다.\n\n농심 레드포스는 이번 연승으로 상승세를 지속하고 있는 상황. 다음 경기 결과에 따라 리그 상위권 경쟁이 더욱 치열해질 것으로 예상되며, 한진 브리온은 하위권 탈출을 위한 전술 개선이 시급한 상황으로 분석된다.	{LCK,"농심 레드포스","한진 브리온","2:1 승리","풀세트 접전",이스포츠}	PUBLISHED	2026-04-21 14:34:34.155	2026-04-21 14:34:34.155	0
cmo8q6bgv001311b5vt3mwn4w	T1, 키움 DRX 완파 '2:0 셧아웃'...승점 동점 경쟁 본격화	lck-match-115548128962840659	2026-04-19 10:00:00	lolesports	Esports	LCK	fixed	T1, 키움 DRX 완파 '2:0 셧아웃'...승점 동점 경쟁 본격화	19일 LCK 3주 차 경기에서 T1이 키움 DRX를 2:0으로 압도했다. 접전을 펼친 두 경기 모두 T1이 제압하며 3승 3패로 승수를 늘렸다.	T1이 4월 19일 LCK 3주 차 경기에서 키움 DRX와의 BO3 대전을 2:0으로 완주했다. 풀세트 접전으로 진행된 이번 경기에서 T1은 연이은 세트를 취하며 상대 팀을 완전히 압도하는 모습을 보여주었다.\n\n이번 승리로 T1은 3승 3패의 전적을 기록하며 승점 경쟁에서 입지를 강화했다. 반면 키움 DRX는 2승 4패로 중원대 팀들과의 격차를 벌리는 상황이 됐다. 리그 중원 이상의 팀들이 밀집된 가운데 T1의 이번 승리는 플레이오프 진출권 확보에 중요한 포인트가 될 것으로 보인다.\n\nT1은 앞으로의 경기에서 연승 기조를 이어나가며 순위 상향을 노려야 한다. 한편 키움 DRX는 연패 위기를 벗어나기 위해 다음 경기에서의 분발이 시급해 보인다.	{LCK,T1,키움DRX,2026시즌,3주차,완파}	PUBLISHED	2026-04-21 14:34:40.399	2026-04-21 14:34:40.399	0
cmo8q61ld001111b5c2vnthcf	KT 롤스터, DN 수퍼스 완파…완벽한 6연승 질주	lck-match-115548128962906239	2026-04-18 10:00:00	lolesports	Esports	LCK	fixed	KT 롤스터, DN 수퍼스 완파…완벽한 6연승 질주	2026년 4월 18일 LCK 3주 차 경기에서 KT 롤스터가 DN 수퍼스를 2:0으로 완파하며 6승 0패의 무패 기록을 이어갔다.	KT 롤스터가 DN 수퍼스와의 BO3 경기에서 2:0으로 완승을 거두며 리그 최고의 전적을 유지했다. 18일 오전 10시에 진행된 3주 차 경기는 풀세트 접전 양상을 띠었으나 KT 롤스터가 끝내기를 장악하며 승리를 확정지었다.\n\nKT 롤스터는 이번 승리로 현재 6승 0패의 무패 기록을 유지하고 있다. 반면 DN 수퍼스는 1승 5패로 리그 하위권에 머물고 있으며, 이번 경기 패배는 팀의 상승세 구축에 큰 숙제가 되고 있다. 승점 기준 KT 롤스터와 DN 수퍼스의 승패 격차가 명확히 드러나며 양 팀의 현재 전력 차이가 경기 결과에 반영됐다.\n\nKT 롤스터는 다가올 경기에서도 선두 자리 지킴이에 집중할 것으로 예상되며, DN 수퍼스는 연패 기조에서 벗어나기 위한 본격적인 재정비가 필요한 상황이다. 앞으로의 경기 운영이 양 팀의 시즌 결과에 중대한 영향을 미칠 것으로 분석된다.	{LCK,"KT 롤스터","DN 수퍼스",2026시즌,3주차,완파,무패}	PUBLISHED	2026-04-21 14:34:27.601	2026-04-21 14:36:43.943	1
cmo9qpuc40000g6sx6mknvjll	Devil May Cry's Netflix Animated Series Looks SSStylish in Action-Packed Season 2 Trailer	https://www.pushsquare.com/news/2026/04/devil-may-crys-netflix-animated-series-looks-ssstylish-in-action-packed-season-2-trailer	2026-04-22 00:00:00	Push Square	Console	PlayStation	fixed	데빌 메이 크라이 Netflix 애니메이션 시즌 2, 화려한 액션으로 돌아온다	Capcom의 인기 게임을 원작으로 한 Netflix 애니메이션 시즌 2가 5월 12일 공개된다.	Netflix가 Capcom의 명작 액션 게임을 바탕으로 제작한 애니메이션 시리즈 '데빌 메이 크라이'의 시즌 2 예고편을 공개했다. 내년 5월 12일에 공개될 예정인 시즌 2는 주인공 단테의 활약을 담은 다양한 액션 장면을 담고 있으며, 시리즈 특유의 스타일리시한 연출이 돋보인다.\n\n공개된 예고편에서는 시즌 2에서 펼쳐질 강렬한 전투 장면들을 엿볼 수 있다. 원작 게임의 매력적인 전투 시스템과 캐릭터를 애니메이션으로 성공적으로 재현한 모습이 드러난다.\n\n데빌 메이 크라이는 Capcom의 대표 액션 프랜차이즈로, 높은 난이도와 화려한 액션으로 오랫동안 팬들의 사랑을 받아왔다. Netflix 애니메이션 시리즈는 이러한 게임의 매력을 영상화하여 게임 팬은 물론 새로운 팬층까지 확보하고 있다.	{"데빌 메이 크라이",Netflix,애니메이션}	PUBLISHED	2026-04-22 07:37:37.492	2026-04-22 07:37:37.492	0
cmo9qqa140000t4szu6qfk7qi	The MindsEye Saga Never Ends as Devs Accuse Studio of Violating Their Privacy	https://www.pushsquare.com/news/2026/04/the-mindseye-saga-never-ends-as-devs-accuse-studio-of-violating-their-privacy	2026-04-21 23:00:00	Push Square	Console	PlayStation	fixed	게임 개발사 프라이버시 침해 혐의로 MindsEye 논란 심화	MindsEye 개발진이 스튜디오의 개인정보 침해 행위를 지적하며 논란이 확대되고 있다.	오픈월드 게임 MindsEye를 둘러싼 논쟁이 출시 1년을 앞두고도 계속되고 있다. 최근 게임의 개발 참여진들이 제작사를 상대로 프라이버시 침해 혐의를 제기하면서 사건이 새로운 국면을 맞이했다.\n\n개발진들의 구체적인 주장에 따르면 스튜디오가 동의 없이 개인정보를 활용했다는 것으로 알려졌다. 이는 단순한 창작 의견 대립을 넘어 법적 문제로 발전할 가능성을 시사하고 있다.\n\nMindsEye는 출시 이후 지속적인 비판에 직면해온 타이틀이다. 이번 프라이버시 침해 논란은 게임의 완성도 문제를 넘어 제작사 내부의 근본적인 신뢰 문제가 존재함을 드러내는 사건으로 평가되고 있다.	{MindsEye,개발사,논란}	PUBLISHED	2026-04-22 07:37:57.833	2026-04-22 07:37:57.833	0
cmo9qqei20001t4szv6xmcrau	'I Want to Tell My Own Stories': The Last of Us Star Troy Baker Is Building a Game Studio	https://www.pushsquare.com/news/2026/04/i-want-to-tell-my-own-stories-the-last-of-us-star-troy-baker-is-building-a-game-studio	2026-04-21 21:00:00	Push Square	Console	PlayStation	fixed	트로이 베이커, 게임 스튜디오 설립해 자신의 이야기를 담은 작품 개발 추진	더 라스트 오브 어스의 조엘 성우 트로이 베이커가 독립 게임 스튜디오를 설립하고 오리지널 게임 제작을 계획 중이다.	성우 트로이 베이커가 자신의 게임 스튜디오를 설립하여 독창적인 게임 타이틀을 개발하겠다는 포부를 밝혔다. 지난 팟캐스트 인터뷰에서 베이커는 게임 업계에서 자신만의 이야기를 표현하고 싶다는 열정을 드러냈으며, 이를 제대로 실현하기 위해 스튜디오 설립에 나선다고 했다.\n\n트로이 베이커는 더 라스트 오브 어스의 조엘과 마우스: P.I. 포 하이어의 잭 페퍼 등 수많은 게임에서 목소리 연기를 통해 게임 팬들에게 잘 알려진 인물이다. 이번 결정은 단순한 성우 활동을 넘어 게임 개발의 전반적인 창의적 과정에 참여하려는 의지를 보여준다.\n\n베이커의 이러한 시도는 게임 산업에서 창의적 표현의 경계를 확장하려는 움직임이며, 자신이 경험한 게임 개발 과정에서의 통찰력을 바탕으로 한 도전이 될 것으로 예상된다.	{"트로이 베이커","게임 스튜디오","더 라스트 오브 어스"}	PUBLISHED	2026-04-22 07:38:03.626	2026-04-22 07:38:03.626	0
cmo9qqikg0002t4sz01i400z6	Helldivers 2 Continues Its Brilliant Run of Post-Launch Content with Another Warbond on PS5	https://www.pushsquare.com/news/2026/04/helldivers-2-continues-its-brilliant-run-of-post-launch-content-with-another-warbond-on-ps5	2026-04-21 20:00:00	Push Square	Console	PlayStation	fixed	헬다이버스 2, 신규 워본드 '엑소 익스퍼츠' 공개	PS5 코업 슈터 헬다이버스 2가 신규 프리미엄 워본드를 선보이며 지속적인 콘텐츠 업데이트를 이어가고 있다.	Arrowhead Games가 헬다이버스 2의 신규 프리미엄 워본드 '엑소 익스퍼츠'를 공개했다. 이번 업데이트는 플레이어들에게 다양한 신규 장비와 꾸미기 요소를 제공하며, 게임의 지속적인 콘텐츠 운영 노력을 보여준다.\n\n엑소 익스퍼츠 워본드에는 새로운 무기, 갑옷, 그리고 커스터마이징 아이템들이 포함되어 있다. 플레이어들은 게임 내 화폐나 구매를 통해 워본드에 접근할 수 있으며, 다양한 개발 단계의 미션에서 활용할 수 있다.\n\n헬다이버스 2는 출시 이후 꾸준한 워본드 업데이트와 신규 맵, 적군 종족 추가 등으로 플레이어 커뮤니티의 관심을 지속적으로 유지해오고 있다. 이번 엑소 익스퍼츠 워본드는 그러한 콘텐츠 확장 계획의 최신 사례다.	{"헬다이버스 2","PlayStation 5","신규 콘텐츠"}	PUBLISHED	2026-04-22 07:38:08.854	2026-04-22 07:38:08.854	0
cmo9qqmk00003t4szgyhcarqh	Cult of the Lamb's Dice Mini Game Is Great on PS5, PS4, But an Official Real Life Version Is Coming Soon	https://www.pushsquare.com/news/2026/04/cult-of-the-lambs-dice-mini-game-is-great-on-ps5-ps4-but-an-official-real-life-version-is-coming-soon	2026-04-21 19:00:00	Push Square	Console	PlayStation	fixed	컬트 오브 더 램, 주사위 미니게임의 실제 보드게임 버전 출시 예정	PS5·PS4에서 인기를 끈 컬트 오브 더 램의 주사위 미니게임이 실물 보드게임으로 제작 중이다.	데볼버 디지털의 대표작 컬트 오브 더 램이 게임을 넘어 실물 보드게임으로 탄생한다. PS5와 PS4 플레이어들 사이에서 호평받은 주사위 미니게임을 기반으로 한 이 프로젝트는 루스트 인 컬트와의 파트너십으로 진행되고 있다.\n\n컬트 오브 더 램은 출시 이후 다양한 DLC를 통해 콘텐츠를 계속 확장해왔으며, 이번 실물 버전은 그 인기를 현실로 확장하는 의미 있는 시도다. 게임에서 즐겨던 주사위 게임플레이를 친구들과 함께 탁자에서 즐길 수 있게 된다.\n\n실물 버전은 디자인웍스 시리즈로 출시될 예정이며, 게임의 개발 비하인드 스토리와 각종 아트워크를 담은 아트북도 함께 제공될 것으로 알려졌다.	{"컬트 오브 더 램",보드게임,PlayStation}	PUBLISHED	2026-04-22 07:38:14.065	2026-04-22 07:38:14.065	0
cmo9qqtki0004t4sznauwepkt	'IP That Will Captivate the World': A New Juggernaut Has Just Entered Japanese Game Publishing	https://www.pushsquare.com/news/2026/04/ip-that-will-captivate-the-world-a-new-juggernaut-has-just-entered-japanese-game-publishing	2026-04-21 18:00:00	Push Square	Console	PlayStation	fixed	도에이가 게임 퍼블리싱 시장에 진출	일본의 대형 엔터테인먼트 기업 도에이가 게임 출판 사업에 본격 참여	일본의 역사 깊은 엔터테인먼트 기업 도에이가 게임 퍼블리싱 영역에 새로운 진입자로 나섰다. 드래곤볼, 원피스, 디지몬, 유희왕 같은 세계적 인기작을 제작한 도에이 애니메이션 스튜디오로 유명한 이 회사는, 80년이 넘는 역사 동안 일본 엔터테인먼트 산업을 이끌어온 주요 플레이어다.\n\n도에이는 그동안 축적한 애니메이션 및 영상 콘텐츠의 풍부한 자산과 브랜드 영향력을 바탕으로 게임 시장 진출을 결정했다. 이는 일본 엔터테인먼트 기업들의 게임 산업으로의 확대 움직임 속에서 주목할 만한 사례다.\n\n도에이의 게임 퍼블리싱 진출은 기존의 애니메이션 콘텐츠를 게임으로 확장하고, 새로운 IP를 개발할 수 있는 기회를 제공할 것으로 예상된다. 이러한 움직임이 게임 산업에 어떤 변화를 가져올지 주목된다.	{도에이,"게임 퍼블리싱","일본 게임사"}	PUBLISHED	2026-04-22 07:38:23.154	2026-04-22 07:38:23.154	0
cmo9qqxjx0005t4sz2lakn23c	Sony Does Its Latest Retro Release Justice with a PS5, PS4 Trophy List	https://www.pushsquare.com/news/2026/04/sony-does-its-latest-retro-release-justice-with-a-ps5-ps4-trophy-list	2026-04-21 17:00:00	Push Square	Console	PlayStation	fixed	소니, PS5·PS4용 와일드 암스 4에 트로피 리스트 지원	클래식 RPG 와일드 암스 4가 플래티넘 트로피를 포함한 28개 트로피와 함께 PlayStation에 출시됐다.	소니가 클래식 RPG 와일드 암스 4를 PlayStation에 추가하면서 플래티넘 트로피를 포함한 완전한 트로피 리스트를 지원하기로 결정했다. 많은 레트로 게임들이 PS Plus Premium과 PS Store를 통해 출시될 때 트로피 시스템 지원 여부가 불투명했던 만큼, 이번 결정은 플레이어들에게 반가운 소식이다.\n\n게임에는 총 28개의 트로피가 준비되어 있으며, 플레이어들은 이를 모두 달성하여 플래티넘 트로피를 획득할 수 있다. 와일드 암스 4는 오랜 시간이 지난 이 클래식 작품을 현세대 콘솔에서 즐길 수 있도록 재출시된 타이틀이다.\n\n게임은 현재 PS Plus Premium 구독으로 이용 가능하며, 구독 서비스를 이용하지 않는 사용자는 £7.99 또는 $9.99의 가격에 개별 구매할 수도 있다.	{PlayStation,"와일드 암스 4","레트로 게임",트로피,"PS Plus Premium"}	PUBLISHED	2026-04-22 07:38:28.317	2026-04-22 07:38:28.317	0
cmo9qr1sz0006t4sztkmeytqe	PS Plus Value Called into Question as Xbox Slashes Game Pass Price	https://www.pushsquare.com/news/2026/04/ps-plus-value-called-into-question-as-xbox-slashes-game-pass-price	2026-04-21 16:30:00	Push Square	Console	PlayStation	fixed	Microsoft의 Game Pass 가격 인하로 PlayStation Plus의 가치 논의 재점화	Xbox Game Pass 가격 인하로 PlayStation Plus와의 경쟁 구도가 재편되고 있다.	Microsoft가 Xbox Game Pass Ultimate와 PC Game Pass의 월간 요금을 인하하기로 발표하면서 게임 구독 서비스 시장에 새로운 바람이 불고 있다. 이는 업계에서 드물게 찾아볼 수 있는 가격 인하 결정으로, 게임 구독 서비스의 가격 경쟁이 본격화되고 있음을 시사한다.\n\nCall of Duty 같은 주요 타이틀의 라인업 변화 속에서 Microsoft의 공격적인 가격 정책은 PlayStation Plus의 경쟁력에 의문을 제기하게 만들고 있다. 구독자들은 두 서비스 간 가격과 게임 라인업을 더욱 면밀히 비교하게 될 것으로 예상된다.\n\nPS Plus가 지난해 개편된 이후 PlayStation 플레이어들 사이에서 가격 대비 가치에 대한 논의가 계속되었던 만큼, 이번 Game Pass의 가격 인하는 소니의 전략 재검토를 촉구하는 신호탄이 될 수 있다.	{"PlayStation Plus","Xbox Game Pass","게임 구독","가격 인하","서비스 경쟁"}	PUBLISHED	2026-04-22 07:38:33.828	2026-04-22 07:38:33.828	0
cmo9qr6fv0007t4szaulyhhe9	Rumour: Ubisoft Working on Another Assassin's Creed Remake Besides Black Flag	https://www.pushsquare.com/news/2026/04/rumour-ubisoft-working-on-another-assassins-creed-remake-besides-black-flag	2026-04-21 16:00:00	Push Square	Console	PlayStation	fixed	유비소프트, 블랙 플래그 외 또 다른 어쌔신 크리드 리메이크 개발 중	유비소프트가 블랙 플래그 리메이크 성공에 이어 추가 어쌔신 크리드 리메이크를 진행 중인 것으로 보도됐다.	유비소프트가 어쌔신 크리드: 블랙 플래그 리신크드 공식 공개 이후 추가 시리즈 리메이크 프로젝트를 진행하고 있는 것으로 알려졌다. 게임 업계 매체의 보도에 따르면 유비소프트는 현재 "최소한 하나 이상"의 어쌔신 크리드 게임을 리메이크하고 있으며, 구체적인 제목은 아직 밝혀지지 않았다.\n\n블랙 플래그 리신크드의 상업적 성공 여부가 향후 추가 리메이크 프로젝트의 진행을 결정할 핵심 요소가 될 전망이다. 만약 현재 개발 중인 리메이크가 긍정적인 반응을 얻으면 더 많은 역작들이 현대식으로 재출시될 가능성도 열려 있는 상황이다.\n\n유비소프트는 파이럿 테마의 블랙 플래그가 시리즈 팬들로부터 가장 인기 있는 작품 중 하나라는 점을 인식하고 있으며, 이번 리메이크 프로젝트를 통해 과거 명작들을 현대 플레이어들에게 소개하려는 전략으로 보인다.	{"어쌔신 크리드",유비소프트,"게임 리메이크"}	PUBLISHED	2026-04-22 07:38:39.835	2026-04-22 07:38:39.835	0
cmo9qrcbr0008t4szydcg12su	Random: Pragmata Has a Fun Surprise for Patient PS5 Players	https://www.pushsquare.com/news/2026/04/random-pragmata-has-a-fun-surprise-for-patient-ps5-players	2026-04-21 15:00:00	Push Square	Console	PlayStation	fixed	PS5 플레이어들이 발견한 카프콤 신작 '프라그마타'의 숨은 재미 요소	PS5 출시한 카프콤의 '프라그마타'에 개발진이 숨겨놓은 다양한 이스터에그가 화제	카프콤의 신작 '프라그마타'가 PlayStation 5에 정식 출시되면서 게이머들 사이에서 호평을 받고 있다. 플레이어들이 게임을 진행하며 개발진이 의도적으로 숨겨놓은 이스터에그와 흥미로운 디테일들을 연달아 발견하고 있어 커뮤니티의 관심이 뜨거워지고 있다.\n\n이 게임에 담긴 숨은 콘텐츠들은 단순한 재미를 넘어 개발진의 창의성과 배려가 엿보이는 요소들로 평가되고 있다. 게이머들은 소셜 미디어를 통해 발견한 이스터에그들을 공유하며 새로운 디테일을 찾는 재미를 즐기고 있다.\n\n'프라그마타'는 카프콤이 선보이는 새로운 IP로서, 게임에 숨겨진 다양한 요소들이 단순한 마케팅을 넘어 플레이어와의 상호작용을 고려해 설계된 것으로 보인다. 이러한 세심한 디테일이 게이머들에게 즐거운 발견의 경험을 선사하면서 게임에 대한 재미를 더하고 있다.	{Pragmata,PS5,카프콤,이스터에그}	PUBLISHED	2026-04-22 07:38:47.463	2026-04-22 07:38:47.463	0
cmo9qrh450009t4szqe1owal2	Elden Ring Is A24's Biggest Movie Yet with a $100 Million Budget	https://www.pushsquare.com/news/2026/04/elden-ring-is-a24s-biggest-movie-yet-with-a-usd100-million-budget	2026-04-21 14:00:00	Push Square	Console	PlayStation	fixed	A24, 엘든링 영화화에 1억 달러 투자... 역대 최대 규모 프로젝트	A24가 엘든링 영화화에 1억 달러를 투자하며 2028년 3월 개봉을 목표로 제작 중이다.	A24가 엘든링 영화 적응작에 역대 최대 규모인 1억 달러의 제작비를 투자한다. 이 프로젝트는 A24의 '가장 야심찬 프로젝트'로 평가받으며, 이미 영국에서 촬영이 시작되었거나 곧 시작될 예정이다. 제작진은 림그레이브와 마리카 교회 등 게임의 주요 배경을 재현하는 세트를 구축한 상태다.\n\n영화 감독은 '엑스 머신'과 '시빌 워'로 호평받은 알렉스 가를랜드가 맡는다. A24는 이 작품에 자사의 또 다른 야심작인 '마티 슈프림'보다 더 많은 자금을 투입하기로 결정했으며, 총 100일간의 주요 촬영을 진행할 계획이다.\n\n영화는 2028년 3월 3일에 개봉될 예정이다. 게임의 광활한 세계관과 독특한 세계 건축이 대형 영화로 구현되는 만큼, A24의 이러한 대규모 투자는 게임 원작 영화화 시장에서의 위상 변화를 보여주는 신호로 해석된다.	{엘든링,영화화,A24,"알렉스 가를랜드"}	PUBLISHED	2026-04-22 07:38:53.67	2026-04-22 07:38:53.67	0
cmo9qrl8q000at4sztxbcjxve	Post-Pragmata, Capcom Starts Hyping Up Onimusha's PS5 Revival	https://www.pushsquare.com/news/2026/04/post-pragmata-capcom-starts-hyping-up-onimushas-ps5-revival	2026-04-21 13:00:00	Push Square	Console	PlayStation	fixed	Capcom, 프라그마타 출시 후 귀무사 PS5 부활작 본격 마케팅 시작	캡콤이 2026년 상반기 일정을 정리하며 귀무사: 칼의 길 대대적 홍보 준비 중	캡콤이 프라그마타 출시를 마친 뒤 올해 일정에 여유가 생기면서 귀무사: 칼의 길의 본격적인 마케팅을 시작할 준비를 갖추고 있다. 장년간 개발이 진행된 이 PS5 독점 액션게임은 캡콤이 올해 중 출시를 공식 확인한 만큼, 조만간 정확한 출시일 공개가 임박한 상황이다.\n\n귀무사: 칼의 길은 오리지널 시리즈의 정신을 잇는 사무라이 액션게임으로, 장시간의 개발 기간 동안 팬들의 기대가 누적되어 있는 상황이다. 캡콤의 일정 조정과 함께 이 게임에 대한 대규모 프로모션 캠페인이 곧 전개될 것으로 예상된다.	{귀무사,Capcom,"PlayStation 5",액션게임}	PUBLISHED	2026-04-22 07:38:59.019	2026-04-22 07:38:59.019	0
cmo9qruq9000ct4szlarm9kg4	One of 2025's Best PS5 Roguelikes Set to Receive Another Huge Free Update Next Week	https://www.pushsquare.com/news/2026/04/one-of-2025s-best-ps5-roguelikes-set-to-receive-another-huge-free-update-next-week	2026-04-21 11:00:00	Push Square	Console	PlayStation	fixed	데볼버 디지털의 PS5 로그라이크 '볼 X 핏', 내주 대규모 무료 업데이트 예정	2025년 올해의 최고 PS5 로그라이크로 평가받는 '볼 X 핏'이 다음 주 두 번째 대형 업데이트를 공개한다.	지난해 PS5에서 예상외의 큰 인기를 얻은 로그라이크 게임 '볼 X 핏'이 또 다른 대규모 무료 업데이트를 앞두고 있다. 데볼버 디지털의 이 작품은 공식 출시 이후 꾸준한 콘텐츠 추가를 통해 게이머들의 관심을 유지해왔으며, 이번 업데이트는 예정된 세 개의 대형 패치 중 두 번째에 해당한다.\n\n게임은 지난 10월 정식 출시된 이후 첫 번째 업데이트를 이미 선보였으며, 이제 그 뒤를 이을 두 번째 업데이트가 내주 중 공개될 예정이다. 개발팀의 이러한 지속적인 지원은 게임의 초기 성공을 바탕으로 플레이어 기반을 더욱 확대하려는 의도로 보인다.\n\n'볼 X 핏'의 성공은 대규모 개발사가 아닌 인디 개발사의 작품이 메이저 플랫폼에서도 충분히 경쟁력을 가질 수 있음을 보여준다. 정기적인 무료 업데이트를 통한 이러한 접근 방식은 최근 게임 업계의 중요한 트렌드가 되었으며, '볼 X 핏'은 이를 성공적으로 실천하고 있다.	{PS5,로그라이크,"무료 업데이트","볼 X 핏","데볼버 디지털"}	PUBLISHED	2026-04-22 07:39:11.314	2026-04-22 07:39:11.314	0
cmo9qryr1000dt4szzfeuf870	PS5 Pro Just Made Pragmata Even Better in New Patch	https://www.pushsquare.com/news/2026/04/ps5-pro-just-made-pragmata-even-better-in-new-patch	2026-04-21 10:00:00	Push Square	Console	PlayStation	fixed	PS5 Pro용 PSSR2 지원 추가된 프라그마타 새 패치 배포	카프콤이 프라그마타 업데이트를 통해 PS5 Pro의 PSSR2 공식 지원을 추가했다.	카프콤이 프라그마타의 새로운 패치를 배포하며 PS5 Pro의 향상된 PSSR2 기술에 대한 공식 지원을 추가했다. 이번 업데이트는 게임이 이미 해당 기능을 활용 중이라는 기술 분석 결과와 달리, 카프콤은 이 패치가 업그레이드된 PSSR에 대한 공식 지원을 추가하는 것이라고 명시했다.\n\n카프콤은 소셜 미디어를 통해 PSSR2 적용 시의 비주얼 개선 사례를 함께 공개했다. 이를 통해 PS5 Pro 사용자들이 프라그마타에서 더욱 향상된 그래픽 품질을 경험할 수 있게 되었다.\n\n이번 패치는 PS5 Pro의 고급 그래픽 기술을 활용하는 게임들이 점차 증가하는 추세를 반영하고 있다. 프라그마타는 차세대 콘솔의 성능을 더 효과적으로 활용하면서 플레이어들에게 더욱 정교한 비주얼 경험을 제공하게 되었다.	{"PS5 Pro",프라그마타,PSSR2}	PUBLISHED	2026-04-22 07:39:16.525	2026-04-22 07:39:16.525	0
cmo9qs2zk000et4szlkzqgioh	April 2026 PS Plus Extra, Premium Games Available to Download Now	https://www.pushsquare.com/news/2026/04/april-2026-ps-plus-extra-premium-games-available-to-download-now	2026-04-21 09:00:00	Push Square	Console	PlayStation	fixed	PS Plus 4월 신작 8종 다운로드 시작, Extra·Premium 회원 지금 플레이 가능	PS5·PS4·클래식 게임 8종이 PS Plus Extra와 Premium에 추가되어 다운로드 가능해졌다.	PlayStation Plus Extra와 Premium 가입자들이 4월에 추가되는 신규 게임 8종을 지금부터 다운로드할 수 있게 됐다. PS5, PS4, 클래식 게임이 포함된 이번 라인업은 영국과 유럽 지역에서 먼저 공개됐으며, 미국은 현지 시간 오늘 중으로 접근 가능해질 예정이다.\n\n이번 월간 업데이트를 통해 PlayStation Plus 구독자들은 다양한 세대의 게임들을 경험할 수 있다. Extra와 Premium 두 상위 구독 티어 모두 동일한 라인업에 접근할 수 있어, 더 많은 사용자가 새로운 타이틀들을 즐길 수 있는 기회를 얻게 됐다.\n\nPlayStation Plus는 매달 신규 게임을 추가하는 방식으로 구독자에게 지속적인 가치를 제공하고 있다. 이번 4월 라인업은 과거에 공개된 예정 목록을 바탕으로 구성됐으며, 서비스 지역별로 단계적으로 롤아웃되는 구조를 따르고 있다.	{"PlayStation Plus",PS5,"신규 게임"}	PUBLISHED	2026-04-22 07:39:22.016	2026-04-22 07:39:22.016	0
cmo9qs6qf000ft4szoo8kan37	You Don't Need a Neo Geo AES+, These Games Are Already on PS5	https://www.pushsquare.com/news/2026/04/you-dont-need-a-neo-geo-aesplus-these-games-are-already-on-ps5	2026-04-21 07:00:00	Push Square	Console	PlayStation	fixed	PS5에서 이미 즐길 수 있는 SNK 클래식 게임들	PS5에 다수의 Neo Geo 클래식 게임이 수록되어 있어 비싼 별도 기기 구매 없이 저렴하게 플레이 가능	Neo Geo AES+에 대한 관심이 높아지고 있지만, SNK의 고전 게임 대부분은 이미 PS5에서 플레이할 수 있다. 새로운 하드웨어에 투자할 필요 없이 PlayStation 5 사용자라면 자신의 콘솔에서 상당수의 명작을 즐길 수 있는 상황이다.\n\nPS5에 수록된 SNK 클래식 게임들은 대부분 Neo Geo AES+ 번들 가격보다 훨씬 저렴한 가격대에 구매할 수 있다. 복고 게임에 관심이 있는 플레이어들에게 경제적으로 합리적인 선택지가 되어준다.\n\n게임 애호가들이 클래식 작품을 다시 접할 수 있는 방법은 계속해서 다양해지고 있으며, 이미 보유한 플랫폼을 통해 이러한 타이틀들을 경험할 수 있다는 점은 게이머들의 선택 폭을 넓혀준다.	{PS5,SNK,"Neo Geo","클래식 게임",PlayStation}	PUBLISHED	2026-04-22 07:39:26.871	2026-04-22 07:39:26.871	0
cmo9qsbi8000gt4szdkv9us8w	Metal Slug Is Back! SNK Teases New PS5 Game for Series' 30th Anniversary	https://www.pushsquare.com/news/2026/04/metal-slug-is-back-snk-teases-new-ps5-game-for-series-30th-anniversary	2026-04-21 02:00:00	Push Square	Console	PlayStation	fixed	SNK, 메탈슬러그 30주년 기념 PS5 신작 티저 공개	메탈슬러그 시리즈가 30주년을 맞아 PS5 신작으로 돌아온다.	SNK가 메탈슬러그 시리즈의 30주년을 기념하며 PS5 플랫폼을 위한 새로운 게임을 준비 중이다. 회사는 공식 웹사이트를 통해 '미션 리부트'라는 콘셉트로 시리즈의 재탄생을 예고했으며, 팬들에게 앞으로의 소식에 주목해달라고 당부했다.\n\n메탈슬러그는 1996년 출시 이후 게이머들에게 사랑받아온 런앤건 장르의 전설적 프랜차이즈다. SNK는 이번 발표를 통해 단순한 시즌 이벤트가 아닌 본격적인 새로운 작품 개발을 암시하고 있어, 업계 관계자와 팬들 사이에서 높은 관심을 불러일으키고 있다.\n\n현재 공개된 정보는 티저 수준에 불과하며, SNK는 추가 세부사항과 출시 일정에 대해 향후 공식 발표할 예정이다. 메탈슬러그 시리즈의 부활이 어떤 형태로 이루어질지에 대한 팬들의 기대감이 높아지고 있다.	{메탈슬러그,PS5,SNK,"신작 게임"}	PUBLISHED	2026-04-22 07:39:33.057	2026-04-22 07:39:33.057	0
cmo9qsfth000ht4szpoe4i5ra	Wild Arms 4 Returns on PS Plus Premium, But Its PS2 Reviews Were Ruthless	https://www.pushsquare.com/news/2026/04/wild-arms-4-returns-on-ps-plus-premium-but-its-ps2-reviews-were-ruthless	2026-04-21 01:00:00	Push Square	Console	PlayStation	fixed	와일드 암즈 4, PS Plus Premium에 추가되지만 당시 평가는 냉혹했다	2005년작 와일드 암즈 4가 PS Plus Premium을 통해 PS5·PS4에 출시된다	소니의 오랜 JRPG 시리즈인 와일드 암즈 4가 이번 주 PS Plus Premium을 통해 PS5와 PS4에 출시될 예정이다. 2005년 발표된 이 작품은 소니가 진행해온 에뮬레이션 서비스에 추가되는 드문 퍼스트파티 타이틀이다.\n\n최근 PS Plus Premium의 클래식 라인업은 반다이남코와 디즈니 같은 외부 퍼블리셔의 게임들로 주로 채워져 왔다. 이번 와일드 암즈 4의 추가는 소니가 자사 개발 타이틀의 에뮬레이션 서비스 확대에도 관심을 기울이고 있음을 보여준다.\n\n다만 와일드 암즈 4는 당시 평론가들로부터 엄격한 평가를 받았던 작품이다. 게임이 당대 기준에서 어떤 평가를 얻었는지는 이 시점에 다시 플레이하는 팬들의 반응을 흥미롭게 만든다.	{PlayStation,"PS Plus Premium","와일드 암즈 4","클래식 게임",에뮬레이션}	PUBLISHED	2026-04-22 07:39:38.645	2026-04-22 07:39:38.645	0
cmo9qsjgc000it4szllm7b95u	Pragmata Looks Best on PS5 Pro, Says Tech Experts	https://www.pushsquare.com/news/2026/04/pragmata-looks-best-on-ps5-pro-says-tech-experts	2026-04-21 00:00:00	Push Square	Console	PlayStation	fixed	PS5 Pro가 프래그마타의 최적 플랫폼, 기술 전문가 분석	PS5 Pro의 PSSR2 업스케일러가 프래그마타에서 탁월한 성능 발휘	기술 분석 전문가 디지털 파운드리가 프래그마타의 그래픽 성능을 평가한 결과, PS5 Pro가 이 게임의 최고 플레이 환경이라는 결론을 내렸다. 소니가 올해 선보인 업그레이드된 PSSR2 업스케일러를 탑재한 PS5 Pro는 동급 콘솔들을 압도하는 성능을 입증하고 있다.\n\n프래그마타는 주인공 휴와 다이애나의 첫 모험을 다루는 게임으로, 이전의 레지던트 이블 레퀴엠처럼 PS5 Pro에서 뛰어난 그래픽 품질을 선사한다. 디지털 파운드리의 분석에 따르면 이 게임도 업그레이드된 콘솔의 강화된 성능을 충분히 활용하여 경쟁 플랫폼보다 우수한 비주얼 경험을 제공한다.	{"PS5 Pro",프래그마타,그래픽}	PUBLISHED	2026-04-22 07:39:43.356	2026-04-22 07:39:43.356	0
cmo9qsn7n000jt4sze859hvf4	Starfield Tops Weekly US Sales Charts Despite 'Disappointing' Early Estimates	https://www.pushsquare.com/news/2026/04/starfield-tops-weekly-us-sales-charts-despite-disappointing-early-estimates	2026-04-20 23:00:00	Push Square	Console	PlayStation	fixed	Starfield가 PS5 출시 후 미국 주간 판매 1위 달성	Starfield가 PS5 버전 출시 이후 2023년 이래 처음으로 미국 주간 판매 차트 1위에 올랐다.	Bethesda의 우주 탐험 게임 Starfield가 4월 7일 PlayStation 5로 정식 출시된 지 일주일 만에 미국 주간 판매 순위 1위를 차지했다. 시장 조사 기관 Circana의 자료에 따르면 4월 11일을 기준으로 한 주간 판매에서 Starfield가 최상위 자리를 기록했으며, 이는 2023년 이후 처음으로 달성한 성과다.\n\nPS5 버전의 성공적인 판매가 전체 수치의 95%를 차지했다. 이는 PlayStation 플랫폼에서의 강력한 입지를 보여준다.\n\n다만 시장 분석사 Alinea Analytics의 추정에 따르면 출시 첫주 전 세계 판매량은 약 14만 유닛으로 업계 기대치보다 낮은 수준을 기록했다. 이 수치는 주말을 포함한 완전한 첫주 기간의 누적 판매량을 반영한 것이다.	{Starfield,"PlayStation 5","게임 판매"}	PUBLISHED	2026-04-22 07:39:48.227	2026-04-22 07:39:48.227	0
cmo9qsrth000kt4szizyzb1sv	PS5 Players Flock to Free Game for Ridiculously Easy Platinum Trophy	https://www.pushsquare.com/news/2026/04/ps5-players-flock-to-free-game-for-ridiculously-easy-platinum-trophy	2026-04-20 20:00:00	Push Square	Console	PlayStation	fixed	PS5 플레이어들 5분 안에 플래티넘 트로피를 얻을 수 있는 무료 게임에 몰려	체스 게임으로 극도로 쉽게 플래티넘을 획득할 수 있어 수천 명의 PS5 유저들이 다운로드 중	PS5 플레이어들이 무료 게임 '체스 메이트'에 대거 몰려들고 있다. 이 게임의 플래티넘 트로피는 체스를 이미 알고 있다면 약 5분 내에 달성할 수 있을 정도로 극단적으로 쉽다는 평가다. 심지어 게임을 처음 접하는 유저도 조금 더 시간을 들이면 충분히 획득 가능한 수준이다.\n\n이는 플레이스테이션의 트로피 시스템이 오랫동안 그 신뢰성을 잃어왔다는 현실을 여실히 드러낸다. 게임성과 무관하게 최소한의 플레이로 플래티넘을 얻을 수 있는 게임들이 등장하면서 일부 유저들은 이를 컬렉션 확장의 수단으로 삼고 있다.\n\n체스 메이트는 무료로 제공되기 때문에 접근 장벽이 전혀 없다는 점이 대규모 다운로드로 이어진 주요 요인이다. 트로피 사냥을 목표로 하는 PS5 유저들이 쉽게 자신의 성과를 늘리려는 경향이 계속되고 있음을 보여주는 사례다.	{"PlayStation 5","무료 게임",트로피}	PUBLISHED	2026-04-22 07:39:54.197	2026-04-22 07:39:54.197	0
cmo9qswb3000lt4szr99vdx8a	'Shimmering-Free 4K at a Silky-Smooth 60fps': Anime Open World NTE Will Push PS5 Pro	https://www.pushsquare.com/news/2026/04/shimmering-free-4k-at-a-silky-smooth-60fps-anime-open-world-nte-will-push-ps5-pro	2026-04-20 19:00:00	Push Square	Console	PlayStation	fixed	NTE: Neverness to Everness, PS5 Pro의 PSSR2 활용해 4K 60fps 구현	애니메이션 오픈월드 게임 NTE가 PS5 Pro 전용 기술로 끝에서 흔들림 없는 4K 60fps 성능을 제공한다.	Sony의 차세대 콘솔 PS5 Pro를 위한 전용 최적화 게임이 속속 공개되고 있다. 애니메이션 스타일의 오픈월드 게임 NTE: Neverness to Everness는 PS5 Pro의 강화된 GPU와 PSSR2 초해상화 기술을 적극 활용하여 흔들림 없는 4K 해상도에서 60Hz 프레임 속도를 안정적으로 유지한다.\n\nNTE는 단순히 높은 해상도 출력을 넘어 PS5 Pro의 하드웨어 성능을 한껏 활용하는 그래픽 기술들을 다수 적용한다. 개발진은 내부 렌더링 해상도를 높이고 복잡한 연산이 필요한 볼루메트릭 포그와 거리장 앰비언트 오클루전 같은 고급 이펙트를 추가하는 방식으로 차세대 콘솔의 성능을 체감할 수 있게 설계했다.\n\n이 게임의 최적화 사례는 PS5 Pro가 기존 PS5보다 얼마나 강력한 성능 향상을 제공하는지를 보여주는 구체적인 예시가 된다. Sony는 PSSR2를 통해 게이밍 업계의 초해상화 기술 경쟁에서도 한 발 앞서 나가는 모습을 입증하고 있다.	{"PS5 Pro","NTE: Neverness to Everness",PSSR2,"4K 60fps"}	PUBLISHED	2026-04-22 07:40:00.016	2026-04-22 07:40:00.016	0
cmo9qt1is000mt4szgg3mz94n	Granblue Fantasy: Relink's Expanded PS5, PS4 Re-Release Adds an Actual Story Intro	https://www.pushsquare.com/news/2026/04/granblue-fantasy-relinks-expanded-ps5-ps4-re-release-adds-an-actual-story-intro	2026-04-20 18:00:00	Push Square	Console	PlayStation	fixed	그랜블루 판타지 릴링크 확장판, PS5·PS4에 새로운 스토리 도입부 추가	2024년 액션 RPG '그랜블루 판타지: 릴링크'의 확장 재출시판이 신규 플레이어를 위한 스토리 인트로를 정식 추가했다.	사이게임스가 확인한 바에 따르면 '그랜블루 판타지: 릴링크 - 엔드리스 라그나록'의 개선된 확장판은 게임 본편으로 진입하기 전 스토리의 배경이 되는 주요 사건들을 설명하는 적절한 입문 과정을 포함하게 된다. 이는 2024년 출시된 원작에서 신규 유저들이 느껴봤을 진입 장벽을 상당히 낮추는 조치다.\n\n제대로 된 인트로 시퀀스의 추가는 작은 변화처럼 보일 수 있지만, 게임 내 스토리와 배경 설정에 익숙하지 않은 플레이어들에게는 매우 의미 있는 개선다. 그랜블루 판타지 시리즈의 광범위한 세계관을 이해하기 위한 기초를 다질 수 있기 때문이다.\n\n사이게임스는 신작 게임뿐 아니라 기존 타이틀의 재출시를 통해 더 많은 플레이어가 접근할 수 있는 환경을 만들고자 노력하고 있다. 특히 복잡한 배경 설정을 가진 게임의 경우 신규 유저 유입이 중요한 성공 요소이기 때문에 이번 개선은 게임의 생명력 연장에도 긍정적인 영향을 미칠 것으로 예상된다.	{"그랜블루 판타지: 릴링크",PlayStation,확장판,"신규 플레이어"}	PUBLISHED	2026-04-22 07:40:06.772	2026-04-22 07:40:06.772	0
cmo9qt6da000nt4szcso7oar6	Rumour: Suspicions of Persona 1 and 2 Remasters Grow Stronger as Soundtrack Reappears	https://www.pushsquare.com/news/2026/04/rumour-suspicions-of-persona-1-and-2-remasters-grow-stronger-as-soundtrack-reappears	2026-04-20 17:00:00	Push Square	Console	PlayStation	fixed	페르소나 1, 2 리마스터 루머 강화, 사운드트랙 재등장으로 재발견	페르소나 1, 2의 리마스터 출시 가능성이 높아지고 있으며, 공식 사운드트랙 재출시와 상품화로 팬들의 기대감 증폭	아틀러스가 페르소나 1과 2의 리마스터 버전을 준비 중일 가능성이 점점 높아지고 있다. 최근 공식 사운드트랙이 다시 등장하면서 팬들 사이에서 新작 출시 추측이 확산되고 있으며, 지난 수주간 발견된 관련 상품들이 이를 뒷받침하고 있다.\n\n시리즈 팬들과 게임 커뮤니티는 초대 페르소나 두 작품에 집중된 의심스러운 마케팅 활동들을 포착했다. 공식 사운드트랙의 예상치 못한 재등장이 특히 주목되고 있으며, 이는 단순한 상품 재유통이 아닌 무언가 더 큰 프로젝트의 신호일 수 있다는 해석이 나온다.\n\n페르소나 시리즈는 장기간 리마스터 소식이 없었던 만큼, 팬들 사이에서는 오리지널 작품들에 대한 재조명 수요가 지속되어 왔다. 아틀러스가 공식 발표를 하기 전까지 이는 루머에 불과하지만, 최근의 일련의 신호들은 관심층의 기대를 적극 자극하고 있다.	{페르소나,리마스터,아틀러스,PlayStation,루머}	PUBLISHED	2026-04-22 07:40:13.054	2026-04-22 07:40:13.054	0
cmo9qtapm000ot4sz6x1gb6jb	Here's A Breakdown Of The New Prices For Xbox Game Pass As Of April 2026	https://www.purexbox.com/news/2026/04/heres-a-breakdown-of-the-new-prices-for-xbox-game-pass-as-of-april-2026	2026-04-21 19:15:00	Pure Xbox	Console	Xbox	fixed	Xbox Game Pass Ultimate 가격 인하, 4월 2026년부터 적용	Xbox가 Game Pass Ultimate와 PC 게임패스 요금을 인하하며 구독 선택지를 더욱 복잡하게 만들었다.	Xbox는 Game Pass Ultimate와 PC 게임패스의 가격을 인하했다. 이번 가격 조정은 영국, 미국, 캐나다, 유럽, 호주 등 주요 지역에서 동시에 적용되며, Essential과 Premium 티어는 기존 가격을 유지한다.\n\nUltimate 티어의 새로운 가격은 영국에서 £16.99, 미국에서 $22.99로 책정됐다. PC 게임패스도 마찬가지로 인하되었으며, 기본 Essential 티어는 영국에서 £10.99, 미국에서 $14.99의 가격대를 유지한다. 다만 이번 가격 인하와 함께 Xbox는 Day One Call of Duty 타이틀을 Game Pass에서 제외하는 변경을 단행했다.\n\n가격 인하로 인해 게이머들은 기본형과 상위형 사이에서 더욱 신중한 선택을 해야 하는 상황이 되었다. Ultimate의 가격이 내려가면서 두 티어 간 가격 차이가 줄어들었기 때문이다.	{Xbox,"Game Pass","가격 인하","구독 서비스"}	PUBLISHED	2026-04-22 07:40:18.682	2026-04-22 07:40:18.682	0
cmo9qtfuk000pt4szw5qmz8yi	Call Of Duty Titles Will No Longer Join Xbox Game Pass On Day One	https://www.purexbox.com/news/2026/04/call-of-duty-titles-will-no-longer-join-xbox-game-pass-on-day-one	2026-04-21 16:26:00	Pure Xbox	Console	Xbox	fixed	Xbox, Call of Duty 게임 Game Pass 첫날 추가 중단	Xbox는 향후 콜오브듀티를 Game Pass 출시 당일에 추가하지 않고, 1년 후 연말에 선보일 방침을 발표했다.	Xbox는 Call of Duty 타이틀이 더 이상 Game Pass에 첫날부터 추가되지 않을 것이라고 공식 발표했다. 게임 패스 정가 인하 발표와 함께 밝혀진 이 결정은 앞으로 콜오브듀티 신작들이 출시 후 약 1년을 경과한 다음 해 연말 시즌에 Game Pass 구독 서비스로 편입될 예정임을 의미한다.\n\nMicrosoft는 이 같은 정책 변화를 통해 콜오브듀티 초기 판매 수익을 극대화하려는 전략으로 보인다. Game Pass 첫날 추가를 미루면서 더 많은 플레이어가 정가로 게임을 구매하도록 유도할 수 있기 때문이다. Xbox는 "Game Pass를 통한 카탈로그 타이틀 지원을 계속하겠다"며 서비스 자체에 대한 약속은 유지할 것임을 강조했다.\n\n이번 결정은 Game Pass Ultimate와 PC 게임 패스의 가격 인하와 맞물려 있는 것으로 해석된다. 첫날 추가 중단으로 인한 초기 구독 매력도 감소를 가격 인하로 보완하려는 의도로 보이며, 동시에 AAA 타이틀의 판매 수익성을 높이려는 Microsoft의 경영 전략 변화를 반영하고 있다.	{"Xbox Game Pass","Call of Duty",Microsoft,"구독 서비스"}	PUBLISHED	2026-04-22 07:40:25.34	2026-04-22 07:40:25.34	0
cmo9qtjyi000qt4sz45h1ehw0	Xbox Announces Price Reductions For Game Pass Ultimate & PC Game Pass	https://www.purexbox.com/news/2026/04/xbox-announces-price-reductions-for-game-pass-ultimate-and-pc-game-pass	2026-04-21 16:11:00	Pure Xbox	Console	Xbox	fixed	Microsoft, Xbox Game Pass Ultimate와 PC Game Pass 요금 인하 단행	Xbox Game Pass Ultimate는 월 $22.99로, PC Game Pass는 월 $13.49로 인하되며 즉시 적용된다.	Microsoft가 Xbox Game Pass Ultimate와 PC Game Pass의 요금을 즉시 인하한다고 발표했다. 미국 기준으로 Xbox Game Pass Ultimate는 기존 월 $29.99에서 월 $22.99로 $7 인상되며, PC Game Pass는 월 $16.49에서 월 $13.49로 $3 인하된다.\n\n이번 요금 조정은 수 시간 내에 모든 사용자에게 적용될 예정이다. 미국 외 다른 지역의 가격 변동은 현재 순차적으로 공개되고 있는 상황이다.\n\nMicrosoft는 이번 가격 인하를 통해 더 많은 게이머들이 Game Pass 서비스에 접근할 수 있도록 하려는 의도로 보인다. 특히 PC 게이머들을 위한 요금 인하는 PC 게이밍 생태계에 대한 Microsoft의 지속적인 투자 의지를 드러낸다.	{Xbox,"Game Pass","요금 인하",Microsoft}	PUBLISHED	2026-04-22 07:40:30.666	2026-04-22 07:40:30.666	0
cmo9qtooa000rt4sz76ebvjvw	Xbox's Starfield Tops The US Gaming Charts For First Time Since 2023	https://www.purexbox.com/news/2026/04/xboxs-starfield-tops-the-us-gaming-charts-for-first-time-since-2023	2026-04-21 15:30:00	Pure Xbox	Console	Xbox	fixed	Starfield이 2023년 이후 처음으로 미국 게임 판매 차트 1위 탈환	Xbox의 Starfield가 PS5 출시 첫 주간 미국 게임 판매 차트에서 1위를 기록했다.	Bethesda의 우주 탐험 RPG Starfield가 PlayStation 5 플랫폼 출시 이후 처음으로 미국 디지털/패키지 게임 판매 차트 1위에 올랐다. 이는 지난 2023년 이후 약 2년 만에 차트 최상단을 차지한 것으로, 게임 분석 기업 Circana의 Mat Piscatella가 보고했다.\n\nStarfield는 PlayStation 5 첫 주간에 약 14만 장을 판매했으며, 이는 최근 다른 Xbox 퍼스트파티 타이틀들과 비교해 상대적으로 건강한 성과로 평가된다. 전문 분석 기관 Alinea Analytics는 이를 '중간 정도의 시작'으로 표현했으나, 닌자 가이든 4와 아우터 월즈 2 같은 최근 Xbox 독점 게임들의 성적보다는 나은 수준이다.\n\n이번 차트 1위는 Xbox가 플랫폼을 뛰어넘어 보유한 주요 타이틀이 여전히 시장에서 실질적인 영향력을 가지고 있음을 보여준다. PlayStation 사용자층의 유입이 게임의 판매 모멘텀을 충분히 회복시킬 수 있었던 것으로 보인다.	{Starfield,"PlayStation 5","판매 차트"}	PUBLISHED	2026-04-22 07:40:36.778	2026-04-22 07:40:36.778	0
cmo9qtste000st4szvrryjj44	Xbox PC Project Might Have Solved How To Fix Hundreds Of 'Broken' Windows Games	https://www.purexbox.com/news/2026/04/xbox-pc-project-might-have-solved-how-to-fix-hundreds-of-broken-windows-games	2026-04-21 14:30:00	Pure Xbox	Console	Xbox	fixed	Xbox PC 레거시 게임 온라인 연결 문제 해결 방안 제시	GitHub 프로젝트가 Windows 8 시대 Xbox 게임의 서버 연결 오류를 해결하는 방법을 공개했다.	Xbox PC 애플리케이션으로 구형 Windows 게임을 실행할 때 온라인 서비스에 연결되지 않는 문제를 해결할 수 있는 방안이 제시됐다. GitHub의 Xbox Collection Tracker 프로젝트는 2010년대 중반 출시된 게임들이 겪는 인증 오류의 근본 원인을 분석하고 해결책을 제안하고 있다.\n\n문제의 원인은 Xbox 서버 인증 체계의 변경에 있다. 과거 Xbox PC 게임들은 'XBL2.0' 형식의 인증 토큰을 사용해 서버와 통신했으나, 마이크로소프트가 이를 최신의 'XBL3.0' 형식으로 업그레이드하면서 구형 게임들이 인식되지 않는 오류가 발생하게 된 것이다.\n\n이 프로젝트는 수백 개에 달하는 영향을 받는 게임들의 문제를 해결하는 방법을 문서화함으로써 Xbox 경영진의 관심을 끌려고 노력 중이다. 레거시 게임들의 온라인 기능을 복구하는 것이 게이머 경험 개선에 중요한 만큼, 이 같은 기술적 해결책이 공식적으로 채택될 가능성이 있다.	{Xbox,PC,"레거시 게임","온라인 연결"}	PUBLISHED	2026-04-22 07:40:42.147	2026-04-22 07:40:42.147	0
cmo9qtxmm000tt4szuaot1trm	Fable Creator Says His New Game Is 'Most Significant Event' In His Entire 40-Year Career	https://www.purexbox.com/news/2026/04/fable-creator-says-his-new-game-is-most-significant-event-in-his-entire-40-year-career	2026-04-21 13:00:00	Pure Xbox	Console	Xbox	fixed	Fable 개발자 피터 몰리뉴, 새 게임을 '40년 경력 최고의 작품'이라 평가	Fable 제작자 피터 몰리뉴의 신작 'Masters of Albion'이 22일 PC로 출시, 향후 Xbox 버전 예정	게임 산업의 거장 피터 몰리뉴가 새로운 프로젝트를 통해 자신의 40년 커리어를 재정의하려 한다. 22일 PC 플랫폼에서 출시되는 'Masters of Albion'은 몰리뉴가 직접 제작을 지휘하는 작품으로, 향후 Xbox 플랫폼으로도 확대될 예정이다.\n\n이 게임은 몰리뉴가 정의한 신 시뮬레이션 장르를 과감하게 재해석한 타이틀로 평가받고 있다. 광활한 세계 탐험, 전투, 도시 건설, 경영 요소 등 다양한 플레이 방식을 담고 있으며, '신의 손(God Hand)' 메커니즘을 통해 플레이어가 알비온 세계 전체를 자유롭게 조종할 수 있도록 설계됐다.\n\n몰리뉴는 이번 프로젝트가 자신의 모든 경력을 통틀어 '가장 중대한 사건'이라고 표현하며 강한 자신감을 드러냈다. 신 게임 장르의 창시자가 수십 년의 경험을 바탕으로 다시 한번 그 경계에 도전하는 만큼, 게임 커뮤니티의 관심이 집중되고 있다.	{"피터 몰리뉴","Masters of Albion","신 시뮬레이션"}	PUBLISHED	2026-04-22 07:40:48.382	2026-04-22 07:40:48.382	0
cmo9qu2tt000ut4szyjf2yqen	Vampire Crawlers Is Getting Great Reviews Alongside Its Xbox Launch	https://www.purexbox.com/news/2026/04/vampire-crawlers-is-getting-great-reviews-alongside-its-xbox-launch	2026-04-21 12:00:00	Pure Xbox	Console	Xbox	fixed	Xbox에 출시된 '뱀파이어 크롤러스' 평단 호평 릴레이	뱀파이어 서바이버스 개발사의 턴 기반 덱빌더 스핀오프 '뱀파이어 크롤러스'가 Xbox 출시와 함께 긍정적인 평가를 받고 있다.	뱀파이어 서바이버스를 만든 개발사의 신작 '뱀파이어 크롤러스'가 Xbox에 정식 출시되며 평론가들로부터 호평을 얻고 있다. 턴 기반 덱빌더 방식의 이 게임은 앞서 Xbox 체험판 단계에서도 긍정적인 반응을 모았으며, 이번 정식 출시로 팬들의 기대가 더욱 높아진 상태다.\n\n게임은 흡사 뱀파이어 서바이버스의 유산을 이어받으면서도 전혀 다른 게임플레이를 제공한다. 카드 기반의 전술적 시스템과 로그라이크 요소를 결합한 이 작품은 원작의 매력과는 다른 차원의 중독성으로 플레이어들을 사로잡을 것으로 예상된다.\n\n이번 주 Xbox Game Pass에는 킬른(Kiln)과 함께 뱀파이어 크롤러스가 추가되었으며, 평론 발표 후 게이머들 사이에서 기대감이 확산되고 있다. 개발사의 입증된 게임 디자인 역량과 이번 신작의 우수한 평가가 맞닿으면서 장기간 사랑받는 타이틀로 자리 잡을 가능성이 높다.	{Xbox,게임패스,뱀파이어크롤러스,신작}	PUBLISHED	2026-04-22 07:40:55.121	2026-04-22 07:40:55.121	0
cmo9quqwi0010t4sz4vksph7x	Xbox To Highlight 'Tons' Of Games In ID@Xbox Showcase Later This Week	https://www.purexbox.com/news/2026/04/xbox-to-highlight-tons-of-games-in-idatxbox-showcase-later-this-week	2026-04-20 13:58:00	Pure Xbox	Console	Xbox	fixed	Xbox가 내달 ID@Xbox 쇼케이스에서 수십 개의 인디 게임 공개	Xbox는 4월 23일 ID@Xbox 쇼케이스를 개최하여 향후 출시될 인디 게임들을 대거 선보일 예정이다.	Xbox는 오는 4월 23일 ID@Xbox 2026 쇼케이스를 개최한다고 발표했다. 이번 행사에서는 Xbox 콘솔으로 출시될 예정인 수십 개의 인디 게임들이 대거 공개될 예정이다.\n\n이미 첫 번째 라인업으로 확정된 게임들이 있으며, Xbox Game Pass에 포함될 다양한 타이틀들이 특별히 조명될 것으로 보인다. ID@Xbox 쇼케이스는 독립 개발사들의 게임을 집중 조명하는 Xbox의 주요 행사다.\n\n이번 쇼케이스는 Xbox의 다양한 게임 생태계를 강화하려는 전략의 일환이다. Xbox는 지속적으로 인디 개발사들과의 협력을 통해 플랫폼의 게임 라이브러리를 확충해오고 있다.	{Xbox,ID@Xbox,인디게임,게임패스}	PUBLISHED	2026-04-22 07:41:26.321	2026-04-22 07:41:26.321	0
cmo9qu7d4000vt4szhsjnecmk	Xbox Exec Chimes In As Rumours Suggest Project Helix Chip Will Be Used For 'Other Machines'	https://www.purexbox.com/news/2026/04/xbox-exec-chimes-in-as-rumours-suggest-project-helix-chip-will-be-used-for-other-machines	2026-04-21 11:00:00	Pure Xbox	Console	Xbox	fixed	Xbox 경영진, Project Helix 칩이 '다른 기기'에도 쓰일 수 있다는 추측에 입장 표명	Xbox 차세대 콘솔 Project Helix의 AMD 칩이 다양한 기기에 활용될 수 있다는 루머에 대해 Xbox 임원이 공식 입장을 밝혔다.	Xbox의 Jason Ronald 임원이 차세대 콘솔 프로젝트를 둘러싼 논란에 직접 나섰다. Project Helix로 불리는 Xbox 차세대 콘솔이 콘솔과 PC 게임을 모두 지원하며 Xbox가 자체 개발한 정식 퍼스트파티 콘솔임이 확실해진 상황에서, 이 프로젝트에 사용될 AMD 칩이 다른 용도로도 활용될 수 있다는 추측이 계속 제기되고 있다.\n\n관련 루머에 따르면 Microsoft가 차기 세대 동안 Project Helix 라인업에 여러 서드파티 기기를 추가로 제공할 가능성이 있다고 지목되고 있다. 이는 단순히 하나의 콘솔 출시에 그치지 않고, 다양한 폼팩터의 기기들을 통해 Xbox 생태계를 확장하려는 전략일 수 있다는 해석이 나온다.\n\nXbox가 콘솔, PC, 클라우드 게이밍을 아우르는 통합 전략을 추진하는 가운데, Project Helix의 기술이 어떤 형태의 기기들에 도입될지에 대한 관심이 집중되고 있다.	{Xbox,"Project Helix","차세대 콘솔"}	PUBLISHED	2026-04-22 07:41:01.001	2026-04-22 07:41:01.001	0
cmo9qucq3000wt4sztsvlsd69	Three Games Are Available Today Across Various Tiers Of Xbox Game Pass (April 21)	https://www.purexbox.com/news/2026/04/three-games-are-available-today-across-various-tiers-of-xbox-game-pass-april-21	2026-04-21 10:00:00	Pure Xbox	Console	Xbox	fixed	Xbox Game Pass에 뱀파이어 크롤러 포함 3개 게임 추가	Xbox Game Pass Premium과 Ultimate에 신작 3종이 동시 공개됐다.	Xbox Game Pass는 4월 21일 신작 3개를 서비스에 추가했다. 이 중 뱀파이어 서바이버스의 스핀오프 작품인 '뱀파이어 크롤러'가 가장 주목받고 있으며, 해당 게임은 Xbox Game Pass의 '데이원' 출시작으로 등록되었다.\n\n뱀파이어 크롤러를 포함해 두 타이틀이 Premium 구독자 전용으로 추가되며, 나머지 한 게임은 Ultimate 구독자와 PC 이용자가 접근할 수 있다. 뱀파이어 크롤러는 한국 시간으로 오후 1시에 서비스 개시될 예정이다.\n\n이번 업데이트는 이번 주 Xbox Game Pass의 첫 번째 콘텐츠 추가로, 프리미엄 게임패스 사용자들에게 신선한 선택지를 제공한다. 서비스 확대는 게임패스의 경쟁력을 지속적으로 강화하려는 마이크로소프트의 전략을 반영한다.	{"Xbox Game Pass","뱀파이어 크롤러","신작 추가"}	PUBLISHED	2026-04-22 07:41:07.946	2026-04-22 07:41:07.946	0
cmo9qufyr000xt4szd0i0k5z0	Xbox Rewards Points Are Being Turned Into An Actual Currency For Buying Games On Console	https://www.purexbox.com/news/2026/04/xbox-rewards-points-are-being-turned-into-an-actual-currency-for-buying-games-on-console	2026-04-20 18:30:00	Pure Xbox	Console	Xbox	fixed	Xbox 리워드 포인트가 게임 구매 화폐로 직접 사용 가능해진다	Xbox 리워드 포인트를 기프트카드 거쳐 환전할 필요 없이 콘솔에서 직접 게임 구매에 사용 가능	Xbox는 리워드 포인트 시스템을 개편해 사용자가 Xbox 및 Microsoft 스토어에서 게임을 직접 구매할 수 있도록 변경할 예정이다. 현재는 리워드 대시보드에 접속해 포인트를 Xbox 또는 Microsoft 기프트카드로 환전한 후 이를 계정에 충전하는 번거로운 과정을 거쳐야 한다.\n\n업데이트 이후에는 리워드 포인트가 실제 화폐처럼 작동하게 되어 환전 절차를 거치지 않고도 콘솔에서 바로 게임을 구입할 수 있다. 기존의 기프트카드 환전 방식은 계속 유지되므로 사용자는 두 가지 방법 중 선택해서 사용할 수 있게 된다.	{Xbox,"리워드 포인트","게임 구매"}	PUBLISHED	2026-04-22 07:41:12.147	2026-04-22 07:41:12.147	0
cmo9qujfe000yt4sz4onqtmrn	Assassin's Creed Black Flag Resynced Is Getting A 'Worldwide Reveal Showcase' This Week	https://www.purexbox.com/news/2026/04/assassins-creed-black-flag-resynced-is-getting-a-worldwide-reveal-showcase-this-week	2026-04-20 16:46:00	Pure Xbox	Console	Xbox	fixed	유비소프트, 어쌔신 크리드 블랙 플래그 리싱크 공개 쇼케이스 개최	유비소프트가 어쌔신 크리드 블랙 플래그의 새로운 버전을 공개하는 글로벌 쇼케이스를 이번 주 개최한다.	유비소프트가 어쌔신 크리드 블랙 플래그의 새 버전인 '리싱크'를 공식 공개하는 글로벌 쇼케이스를 4월 23일 목요일에 개최한다. 이번 발표를 통해 오랫동안 개발 중이던 리마스터 또는 리메이크 버전의 정확한 모습이 공개될 것으로 예상된다.\n\n해당 쇼케이스는 온라인을 통해 생중계되며, 유비소프트는 이 자리에서 게임의 세부 사항과 출시 계획 등을 구체적으로 설명할 것으로 보인다. 팬들 사이에서는 수년간 블랙 플래그 리마스터에 대한 기대감이 높았던 만큼 이번 공개 행사에 관심이 집중되고 있다.	{"어쌔신 크리드","블랙 플래그",리마스터,Xbox,유비소프트}	PUBLISHED	2026-04-22 07:41:16.634	2026-04-22 07:41:16.634	0
cmo9qumvq000zt4szl7n0cxqr	Xbox Unveils New Controller And Headset For Forza Horizon 6	https://www.purexbox.com/news/2026/04/xbox-unveils-new-controller-and-headset-for-forza-horizon-6	2026-04-20 14:39:00	Pure Xbox	Console	Xbox	fixed	Xbox, 포르자 호라이즌 6 특별판 컨트롤러와 헤드셋 공개	포르자 호라이즌 6 테마 Xbox 컨트롤러와 헤드셋이 5월 19일 출시된다.	Xbox가 포르자 호라이즌 6를 기념하는 특별 제품들을 공식 발표했다. 신규 컨트롤러와 헤드셋 두 가지 제품의 사전 예약이 오늘부터 시작되며, 5월 19일 동시 출시될 예정이다.\n\n포르자 호라이즌 6 에디션 컨트롤러는 표준 Xbox 컨트롤러 디자인을 기반으로 게임의 감성을 담아냈다. 전면은 투명한 바디에 각종 트랙 레이아웃이 새겨져 있으며, 후면에는 호라이즌 페스티벌 로고가 배치되어 있다.\n\n컨트롤러는 £84.99(약 $89.99)의 가격대이며, 헤드셋은 £124.99(약 $134.99)에 판매된다. 게임 팬들은 두 제품을 함께 구매하거나 개별적으로 선택할 수 있다.	{Xbox,"포르자 호라이즌 6",주변기기,특별판}	PUBLISHED	2026-04-22 07:41:21.11	2026-04-22 07:41:21.11	0
cmpciuxj3001paa8a7aqr7thl	'There's Truth to It': Sony 'Considering' Bringing Back Your Fave Franchises on PS5	https://www.pushsquare.com/news/2026/05/theres-truth-to-it-sony-considering-bringing-back-your-fave-franchises-on-ps5	2026-05-17 14:00:00	Push Square	Console	PlayStation	fixed	PlayStation 5, 소니 '기존 프랜차이즈 부활' 공식 검토 중... 팬들의 신뢰 회복 신호	소니가 PS5 플랫폼에서 단절된 인기 게임 프랜차이즈의 부활을 공식적으로 검토 중임을 밝혔다. 1억 대 판매를 앞두고도 라이브 서비스 게임 실패와 커뮤니티 소통 부족으로 브랜드 신뢰도가 급락한 가운데, 팬들의 향수를 자극하는 복구 전략으로 평가된다.	소니가 PS5 플랫폼에서 단절된 인기 게임 IP(지식재산)의 복귀를 적극 검토하겠다는 입장을 밝혔다. 현재 PS5는 1억 대 판매 수량에 가까워지는 등 하드웨어 판매 측면에서는 호조를 보이고 있으나, 팬 커뮤니티로부터의 신뢰도는 역사적 저점에 머무르고 있는 상황이다. 이는 소니의 라이브 서비스 게임 전략 실패와 플레이스테이션 커뮤니티와의 소통 부족이 누적된 결과로 분석된다.\n\n소니의 이 같은 전략적 방향 전환은 단순한 마케팅 신호를 넘어 PS5의 소프트웨어 라인업 재편의 신호탄으로 해석된다. 라이브 서비스 게임에 대규모 자본을 투자했다가 예상 외의 참패를 당한 소니는 이제 '정통 싱글플레이 게임'과 '팬들이 열망하는 기존 프랜차이즈'로의 복귀를 고려하고 있는 것으로 보인다. 이러한 변화는 PlayStation의 IP 포트폴리오 다양화와 플레이스테이션 플러스(PS Plus) 구독 서비스의 라인업 강화에도 직결될 가능성이 높다.\n\n게이밍 업계 관계자들은 이번 발표를 '소니의 팬 중심 노선 복귀'의 신호로 평가하고 있다. 특히 지난 몇 년간 소니의 신작 독점작 공개가 줄어들고, 기존 프랜차이즈의 리부트나 신작 발표가 미뤄지면서 누적된 팬들의 불만을 해소하려는 시도로 읽힌다. PS5가 보유한 강력한 하드웨어 성능(4K 레이 트레이싱, 고주사율 게이밍 지원)을 활용해 향수의 IP를 현대적으로 재창조하는 것이 소니의 차기 전략으로 전망된다.\n\n현재 소니가 검토 중인 구체적인 프랜차이즈 명칭과 개발 일정은 아직 공식 공개되지 않았다. 다만 PS4 세대에서 단절되었거나 최근 신작이 발표되지 않은 주요 IP들(라챠드, 언차티드 계열 등)의 부활 가능성이 커뮤니티에서 주목받고 있다. 한국 플레이스테이션 팬들은 공식 한글 자막 지원을 조건으로 하는 새 타이틀의 출시를 기대하고 있으며, 구체적인 공지는 2024년 하반기 플레이스테이션 쇼케이스를 통해 이루어질 것으로 예상된다.	{"PlayStation 5","프랜차이즈 부활","소니 전략","IP 포트폴리오","라이브 서비스 게임"}	PUBLISHED	2026-05-19 11:00:38.609	2026-05-19 11:00:38.609	0
cmo9quuhv0011t4sz4g854jtw	These 10 Games Are Coming To Xbox Game Pass (April 21-May 5)	https://www.purexbox.com/news/2026/04/these-10-games-are-coming-to-xbox-game-pass-april-21-may-5	2026-04-20 13:24:00	Pure Xbox	Console	Xbox	fixed	Xbox Game Pass, 4월 21일부터 5월 5일까지 10개 신작 추가	Final Fantasy V, Trepang2 등 10개 게임이 Xbox Game Pass에 순차 추가될 예정	Microsoft가 Xbox Game Pass에 4월 21일부터 5월 5일까지 추가될 10개의 게임 라인업을 공개했다. 이번 물량에는 그동안 공식 발표가 없었던 Trepang2와 Final Fantasy V가 포함되어 있어 구독자들의 주목을 끌고 있다.\n\n이번 추가 게임들은 4월의 마지막 주차와 5월 초반에 걸쳐 순차적으로 서비스될 예정이다. 최종환상 시리즈의 클래식 타이틀인 Final Fantasy V는 장기간 게임패스 구독자들이 기다려온 작품으로 평가받고 있다.\n\nMicrosoft는 정기적으로 게임패스 라인업을 업데이트하며 구독 서비스의 경쟁력을 강화하고 있다. 이러한 주기적인 신작 추가를 통해 다양한 장르의 게임을 즐기려는 사용자들의 수요를 충족하고 있다.	{"Xbox Game Pass",Microsoft,게임추가}	PUBLISHED	2026-04-22 07:41:30.979	2026-04-22 07:41:30.979	0
cmo9quyyz0012t4sz9on8nhiw	Microsoft Rewards Announces Major Changes For May 2026 Across Multiple Regions	https://www.purexbox.com/news/2026/04/microsoft-rewards-announces-major-changes-for-may-2026-across-multiple-regions	2026-04-20 12:15:00	Pure Xbox	Console	Xbox	fixed	Microsoft Rewards, 5월 2026년 대규모 개편 예고	Microsoft Rewards가 유럽을 포함한 다양한 지역에서 5월 대규모 멤버십 개편을 추진할 예정	Microsoft는 Xbox Rewards 사용자들을 대상으로 5월 2026년 대규모 변경 사항을 적용할 계획임을 공식 발표했다. 영국을 비롯한 유럽 지역의 사용자들이 최근 이러한 개편 계획에 대한 공식 알림을 받기 시작했으며, 이전의 산발적인 공지와 달리 이번에는 광범위한 지역에서 동시에 진행될 것으로 보인다.\n\n지난 몇 개월 동안 일부 사용자들이 변경 예고 알림을 받은 것으로 알려졌으나, 이번 5월 개편은 훨씬 광범위한 규모로 진행될 예정이다. Microsoft는 이번 개편이 멤버십 경험을 크게 향상시킬 것이라고 강조했으며, 구체적인 변경 내용은 향후 추가로 공개될 예정이다.\n\n이번 변경은 Xbox 보상 프로그램의 가치를 재정의하려는 Microsoft의 노력의 일환으로 해석된다. 게이머들의 충성도를 강화하고 서비스 사용성을 개선하는 방향으로 추진될 것으로 예상된다.	{Xbox,"Microsoft Rewards","멤버십 개편",2026년}	PUBLISHED	2026-04-22 07:41:36.779	2026-04-22 07:41:36.779	0
cmo9qv2zj0013t4szib4bn6n9	Xbox's Next First-Party Game Arrives This Week, And Preloads Have Already Begun	https://www.purexbox.com/news/2026/04/xboxs-next-first-party-game-arrives-this-week-and-preloads-have-already-begun	2026-04-20 11:17:00	Pure Xbox	Console	Xbox	fixed	Xbox 독점 게임 'Kiln' 이번 주 출시, 사전 로드 시작	Double Fine의 도자기 테마 멀티플레이어 게임 'Kiln'이 4월 23일 Xbox Game Pass Ultimate와 PC에 출시된다.	Double Fine이 개발한 Xbox 독점 타이틀 'Kiln'이 4월 23일 목요일 Xbox Game Pass Ultimate와 PC를 통해 출시된다. 현재 사전 로드가 진행 중이며, 게임을 미리 다운로드할 수 있는 상태다.\n\n'Kiln'은 도자기를 중심으로 한 온라인 멀티플레이어 게임으로, 플레이어들은 도자기 물레 위에서 자신만의 '세라믹 전투 갑옷'을 만들고 이를 갖춘 팀이 4대4 전투에 나선다. 창의성을 강조하는 Double Fine의 특징이 잘 드러나는 프로젝트로, 비교적 소규모 규모이지만 스튜디오의 명성과 게임의 독특한 콘셉트에 힘입어 충분한 재미와 품질을 기대할 수 있다.	{Xbox,"Game Pass","Double Fine",Kiln,멀티플레이어}	PUBLISHED	2026-04-22 07:41:41.982	2026-04-22 07:41:41.982	0
cmo9qv7fg0014t4sz5ngsgpr3	Xbox Boss Wants A 'Chat' With Ex-PlayStation Exec Over Criticisms Of Game Pass	https://www.purexbox.com/news/2026/04/xbox-boss-wants-a-chat-with-ex-playstation-exec-over-criticisms-of-game-pass	2026-04-20 10:00:00	Pure Xbox	Console	Xbox	fixed	Xbox 게임 패스 비판에 응하는 샤르마, 전 플레이스테이션 경영진과 '대화' 제안	Xbox 게임 패스 구조 개선을 추진 중인 샤르마가 전 PlayStation CEO의 비판에 대응할 준비를 밝혔다.	Xbox 게임 패스의 미래 방향을 두고 업계 내 논쟁이 커지고 있다. 아샤 샤르마 Xbox 경영진은 게임 패스의 가격 인하와 유연성 강화를 추진 중이며, 이에 대한 비판 의견에 귀 기울일 의사를 보였다.\n\n논란의 중심에는 전 PlayStation CEO인 숀 레이든의 발언이 있다. 샤르마의 게임 패스 가격 인하 계획을 담은 메모가 공개되자, 레이든은 현재의 게임 패스 구조에 대해 "불리한 진단과 어두운 전망"을 가지고 있다고 지적하며, 업계 전체가 이에 대한 "명확한 사후 분석"의 필요성을 공감할 것이라고 주장했다.\n\n샤르마는 이러한 비판에 대해 직접적인 대화를 통해 의견을 나눌 준비가 되어 있다는 입장을 표했다. 이는 게임 패스의 지속 가능성과 산업 내 구독 서비스 모델의 미래에 대한 업계 내 관심이 높아지고 있음을 시사한다.	{Xbox,"게임 패스","Asha Sharma",PlayStation,"구독 서비스"}	PUBLISHED	2026-04-22 07:41:47.741	2026-04-22 07:41:47.741	0
cmo9qvbej0015t4sz52yn5egv	Talking Point: What's A 'Good Deal' For An Xbox Series X or S In 2026?	https://www.purexbox.com/features/talking-point-whats-a-good-deal-for-an-xbox-series-x-or-s-in-2026	2026-04-19 15:00:00	Pure Xbox	Console	Xbox	fixed	Xbox Series X/S의 적정 가격대, 2026년 현재 기준은 무엇인가	세대가 진행되며 가격이 오른 Xbox Series X/S, 출시가보다 비싼 '할인'도 나타나는 상황	Xbox Series X와 Series S의 '좋은 거래' 기준을 정하기가 점점 어려워지고 있다. 현재 콘솔 세대는 과거와 달리 지속적인 가격 인하 추세를 보이지 않고 있으며, 오히려 두 기종 모두 출시 이후 상당히 오른 상태다.\n\n소비자들이 Xbox Series X나 Series S를 구매했을 때 과연 좋은 거래를 한 것인지 묻는 질문이 여전히 나오고 있다. 문제는 현재 할인 가격이 수 년 전 정가보다 더 비싼 경우까지 나타나고 있다는 점이다.\n\n이는 과거 콘솔 세대와 크게 다른 흐름이다. 역대 게임 콘솔들은 세대가 진행되면서 자연스럽게 가격이 내려가는 것이 일반적이었지만, 현 세대에서는 이러한 기본적인 시장 논리가 통하지 않고 있는 상황이다.	{Xbox,"Xbox Series X","가격 정책",콘솔}	PUBLISHED	2026-04-22 07:41:52.891	2026-04-22 07:41:52.891	0
cmpciv78c001qaa8a64fy3sfy	Feature: 15 Years Ago Today, We All Pushed Square to Doubt	https://www.pushsquare.com/features/15-years-ago-today-we-all-pushed-square-to-doubt	2026-05-17 11:00:00	Push Square	Console	PlayStation	fixed	PlayStation 3 시대의 혁신작 'L.A. Noire' 15주년... 안면 인식 기술이 바꾼 범죄 수사 게임의 모든 것	2011년 Rockstar Games가 발매한 'L.A. Noire'가 15주년을 맞이했다. 호주 Team Bondi가 개발한 이 PS3 독점작은 당시 획기적이었던 안면 모션 캡처 기술로 NPC의 감정 표현을 실시간으로 읽어낼 수 있게 했으며, 범죄 수사 게임의 새로운 표준을 제시했다.	'L.A. Noire'는 2011년 PlayStation 3 플랫폼을 기점으로 게임 역사에 기록된 혁신작이다. 원래 소니의 PS3 독점작으로 공식 발표됐던 이 타이틀을 Rockstar Games가 글로벌 퍼블리싱을 맡으면서 멀티플랫폼으로 확대되었지만, 초기 개발사인 호주의 Team Bondi가 구현한 안면 인식 기술의 진가는 PS3 버전에서 가장 선명하게 드러났다. 1940년대 로스앤젤레스를 배경으로 한 이 범죄 수사 게임은 단순한 스토리 진행을 넘어 인물 심문 중 대면자의 얼굴 미묘한 표정 변화를 추적하는 심리 분석 요소를 게임플레이의 핵심으로 삼았다.\n\n당시 기술 기준으로 'L.A. Noire'의 안면 모션 캡처는 게임 업계 최고 수준이었다. 실제 배우의 얼굴을 고해상도로 스캔한 후 이를 게임 엔진에 적용해 눈 깜빡임, 미간 찌푸림, 입가 떨림 등 인간관계의 신뢰도를 판단할 수 있는 모든 신체 신호를 재현했다. PS3의 Cell 프로세서가 이 복잡한 안면 애니메이션을 실시간으로 처리하는 것 자체가 당시로서는 기술적 경이였으며, 이를 통해 단순한 대사 선택 시스템을 넘어 '상대방의 거짓을 눈으로 읽는다'는 게임플레이 개념을 완성시켰다.\n\n'L.A. Noire'의 성공은 이후 게임 개발사들의 안면 인식 기술 투자를 촉발했다. 2010년대 중반 이후 AAA급 타이틀들이 모두 고해상도 얼굴 렌더링과 동적 표정 시스템을 표준 요소로 채택한 것은 이 게임의 영향력을 증명한다. 다만 플레이스테이션 플랫폼은 이 작품으로 '스토리 중심 범죄 게임'이라는 서사적 정체성을 확보했으며, 이는 이후 Rockstar의 'Red Dead Redemption' 시리즈, Sucker Punch의 'Ghost of Tsushima' 등으로 계승되는 PS만의 게임 설계 철학이 되었다.\n\n'L.A. Noire'는 현재 PlayStation 5 하위호환성을 통해 4K 업스케일링으로 플레이 가능하며, 국내에서도 PS Store를 통해 구매할 수 있다. 정식 한글 자막이 지원되므로 국내 유저도 1940년대 미국 범죄 수사극을 온전히 경험할 수 있다. 다만 PS3 출시 당시 정가 6만 9,800원에서 현재 PS Store의 판매가는 변동될 수 있으니 확인이 필요하다.	{"PlayStation 3","L.A. Noire","안면 모션 캡처 기술","범죄 수사 게임","Team Bondi","Rockstar Games","15주년 회고"}	PUBLISHED	2026-05-19 11:00:51.42	2026-05-19 11:00:51.42	0
cmo9qvh9n0016t4szctsgsw8p	Feature: You're The Xbox Boss And Need To Figure Out Exclusivity, What Decision Are You Making?	https://www.purexbox.com/features/youre-the-xbox-boss-and-need-to-figure-out-exclusivity-what-decision-are-you-making	2026-04-19 13:00:00	Pure Xbox	Console	Xbox	fixed	Xbox 신임 리더 앞의 선택, 독점 게임 전략을 어떻게 재정의할 것인가	Xbox의 독점 게임 정책 전환으로 팬들의 우려가 커지자, 신임 리더십이 향후 전략을 재검토해야 하는 상황	마이크로소프트의 Xbox는 최근 몇 년간 독점 게임 제공 전략을 대폭 축소해왔다. 포르자, 기어스 오브 워, 심지어 올해 출시 예정인 헤일로까지 주요 프랜차이즈들이 콘솔 독점 지위를 잃게 되면서 팬들 사이에서 큰 논란이 일고 있다. 이러한 정책 변화는 그동안 필 스펜서, 사라 본드 등 경영진의 의도로 알려져 왔지만, 새로운 리더인 아샤 샤르마에게는 향후 방향을 결정해야 하는 무거운 책임이 부여된 상태다.\n\nXbox 커뮤니티 내에서는 콘솔 독점 게임의 복귀 가능성에 대한 관심이 높아지고 있다. 충성도 높은 팬들은 회사가 향후 어떤 방향으로 나아갈지 명확한 입장을 원하고 있으며, 독점 타이틀이 다시 돌아올 수 있을지에 대해 궁금해하고 있다.\n\n이 결정은 단순한 사업 전략을 넘어 Xbox 플랫폼의 정체성과 팬들과의 신뢰 관계를 좌우할 핵심 사항이 되어가고 있다. 독점 게임의 부재가 콘솔 구매 결정에 미치는 영향을 고려할 때, 새로운 리더십의 판단이 Xbox의 미래를 결정짓는 중요한 분기점이 될 것으로 보인다.	{Xbox,"독점 게임",마이크로소프트,"게임 전략"}	PUBLISHED	2026-04-22 07:42:00.33	2026-04-22 07:42:00.33	0
cmo9qvlyy0017t4szr9y3n4g8	50+ Xbox Games & DLC Are Reduced By 90% In The Post-Spring Sales	https://www.purexbox.com/news/2026/04/50plus-xbox-games-and-dlc-are-reduced-by-90percent-in-the-post-spring-sales	2026-04-19 11:00:00	Pure Xbox	Console	Xbox	fixed	Xbox 봄 시즌 세일 종료 후 600개 이상 게임·DLC가 최대 90% 할인	Metro, Mortal Shell 등 50개 이상 게임이 90% 할인되는 포스트 스프링 세일 진행 중	Xbox는 봄 시즌 세일이 끝난 후에도 대규모 할인 행사를 계속 진행하고 있다. ID@Xbox Unhalloween Sale, Publisher Spotlight Series Sale, Beyond Spring Sale 등 여러 프로모션을 통해 600개 이상의 게임과 DLC를 할인 중이며, 이 중 상당수가 90%라는 파격적인 인하율을 기록하고 있다.\n\n메트로 사가 번들, 몰탈 셸: 인핸스드 에디션, 보더랜즈 3, 여러 LEGO 게임 등 인기 타이틀들이 대폭 할인 대상에 포함되어 있다. Beyond Spring Sale은 특히 DLC 콘텐츠에 집중된 행사로, 기존 게임을 소유한 플레이어들도 추가 콘텐츠를 저렴하게 구매할 수 있다.\n\n이는 Xbox의 지속적인 가치 제공 정책으로, 게이머들이 언제든 다양한 타이틀을 경제적으로 접할 수 있도록 하는 전략이다. 할인 기간 동안 평소에 관심 있던 게임을 충동구매 없이 신중하게 살펴볼 기회를 제공한다.	{Xbox,세일,할인,게임,DLC}	PUBLISHED	2026-04-22 07:42:06.587	2026-04-22 07:42:06.587	0
cmo9qvq6g0018t4sz8h9cob1y	Talking Point: What Are Your First Impressions Of Replaced On Xbox Game Pass?	https://www.purexbox.com/features/talking-point-what-are-your-first-impressions-of-replaced-on-xbox-game-pass	2026-04-18 15:00:00	Pure Xbox	Console	Xbox	fixed	Replaced가 Xbox Game Pass에 출시되며 긍정적인 평가 쏟아져	Sad Cat Studios의 네온 스타일 플랫포머 Replaced가 드디어 Xbox Game Pass에 입성했고 평론가들의 호평을 받고 있다.	오랜 기다림 끝에 Replaced가 마침내 Xbox Game Pass에 도착했다. Sad Cat Studios가 제작한 네온 톤의 플랫포머 게임은 출시 첫주부터 평론가들의 호평을 받으며 순조로운 출발을 알렸다.\n\n메타크리틱 점수가 80대 중반에 머물러 있을 정도로 Replaced는 평가 영역에서 충분히 좋은 성과를 내고 있다. 게임의 독특한 비주얼 스타일과 플랫포머로서의 완성도가 점수에 반영된 것으로 보인다.\n\nXbox Game Pass 구독자들은 이제 추가 비용 없이 이 게임을 즉시 플레이할 수 있다. 게임을 이미 경험한 플레이어들의 첫인상이 어떨지 궁금한 상황이다.	{"Xbox Game Pass",Replaced,플랫포머}	PUBLISHED	2026-04-22 07:42:12.04	2026-04-22 07:42:12.04	0
cmo9qvukw0019t4szwbasibhm	'Enthusiastic About Eventually Coming To Consoles' - Windrose Developer On Potential Xbox Version	https://www.purexbox.com/news/2026/04/enthusiastic-about-eventually-coming-to-consoles-windrose-developer-on-potential-xbox-version	2026-04-18 13:30:00	Pure Xbox	Console	Xbox	fixed	윈드로즈 개발사, Xbox 출시에 긍정적 입장 표현	Steam 얼리액세스 첫 48시간에 50만 장 판매한 해양 생존 게임 윈드로즈, Xbox 콘솔 버전 출시 검토 중	Steam 얼리액세스 출시 직후 폭발적인 반응을 얻고 있는 윈드로즈의 개발사가 Xbox 플랫폼 진출에 대해 긍정적인 태도를 드러냈다. 게임은 첫 48시간 동안 50만 장을 판매하며 해양 생존 장르의 강한 수요를 입증했다.\n\n윈드로즈는 절차 생성 방식의 개방형 세계를 배경으로 탐험, 건설, 전투를 통해 생존하는 PvE 어드벤처 게임이다. 최대 8명까지 온라인 협력 플레이가 가능하며 솔로 오프라인 플레이도 지원한다. 이러한 다양한 플레이 옵션과 높은 완성도가 초기 성공을 이끈 것으로 보인다.\n\n최근 몇 년간 스컬앤본즈 같은 해양 테마 게임들이 기대에 미치지 못한 반면, 윈드로즈는 시장의 공백을 메우며 새로운 가능성을 보여주고 있다. 개발사의 Xbox 출시 검토 움직임은 플랫폼 간 확장을 통해 성공의 기반을 더욱 견고히 하려는 전략으로 해석된다.	{윈드로즈,Xbox,Steam,얼리액세스}	PUBLISHED	2026-04-22 07:42:17.699	2026-04-22 07:42:17.699	0
cmo9qvywq001at4sz7imr9eb6	Feature: These 30+ Games Are Coming To Xbox Next Week (April 20-24)	https://www.purexbox.com/features/these-30plus-games-are-coming-to-xbox-next-week-april-20-24	2026-04-18 12:00:00	Pure Xbox	Console	Xbox	fixed	Xbox, 4월 20~24일 30개 이상 신작 게임 출시	로드 96 개발팀의 새로운 모험게임부터 Game Pass 신작까지 다양한 타이틀이 Xbox에 대거 출시될 예정	Xbox는 다음 주(4월 20~24일) 30개 이상의 신작 게임을 출시할 준비를 하고 있다. 이번 라인업에는 독립 액션 어드벤처 타이틀부터 인기 MMO까지 다양한 장르의 게임들이 포함되어 있어 다양한 취향의 플레이어들을 만족시킬 것으로 보인다.\n\n주목할 만한 신작으로는 로드 96의 제작팀이 개발한 싱글플레이 어드벤처 '타이즈 오브 투모로우'와 비트-엠-업 장르의 '제이 앤드 사일런트 밥: 크로닉 블런트 펀치'가 있다. 인기 MMORPG 알비온 온라인도 Xbox 플랫폼으로 새롭게 진출한다.\n\nGame Pass 구독자들을 위한 신규 타이틀도 여럿 준비되어 있다. '킬른'과 '뱀파이어 크롤러스'를 포함한 4개의 Game Pass 신작이 이 기간에 추가될 예정이며, 기존 구독자들은 이들 게임을 별도 비용 없이 즐길 수 있다.	{Xbox,"Game Pass","신작 게임",4월}	PUBLISHED	2026-04-22 07:42:23.354	2026-04-22 07:42:23.354	0
cmo9qw37g001bt4sz2dfh7e0d	Talking Point: What Are You Playing This Weekend? (April 18-19)	https://www.purexbox.com/features/talking-point-what-are-you-playing-this-weekend-april-18-19	2026-04-18 11:00:00	Pure Xbox	Console	Xbox	fixed	Xbox 게이머들이 이번 주말에 플레이할 게임은	Game Pass 신작부터 화제의 신작까지, 이번 주말 Xbox 플레이리스트	바쁜 한 주를 마감하는 주말, Xbox 게이머들에게는 할 게 많다. 최근 Game Pass에 추가된 신작들과 주목할 만한 뉴스들로 가득한 한 주를 보낸 만큼, 주말 내내 즐길 수 있는 타이틀들이 충분히 준비되어 있다.\n\nGame Pass 구독자들을 위한 신규 게임 라인업이 이번 주말을 더욱 풍성하게 만들고 있다. 최신 소식과 함께 공개된 쇼케이스 영상들도 게이머들의 기대감을 높이고 있어, 이번 주말은 새로운 경험을 원하는 플레이어들에게 최적의 타이밍이다.\n\nXbox 플랫폼을 중심으로 한 이번 주 소식들은 게이머 커뮤니티에서 활발한 논의를 이끌어내고 있다. 주말을 맞아 어떤 게임을 플레이할지 고민하는 Xbox 팬들에게는 선택지 자체가 풍부한 상황으로, 개인의 취향에 맞는 타이틀을 찾기에 최적의 시점이 되었다.	{Xbox,"Game Pass","주말 게임","신작 게임"}	PUBLISHED	2026-04-22 07:42:28.924	2026-04-22 07:42:28.924	0
cmo9qw7zj001ct4sz1ngy4f8q	Two Long-Awaited Xbox Indies Have Sadly Been Delayed Out Of April	https://www.purexbox.com/news/2026/04/two-long-awaited-xbox-indies-have-sadly-been-delayed-out-of-april	2026-04-18 09:30:00	Pure Xbox	Console	Xbox	fixed	Xbox 기대작 인디게임 2개 4월 출시 연기	아웃바운드와 헤맨 게임이 각각 5월과 여름으로 출시 일정 연기	Xbox 플랫폼에서 기다리던 인디게임 두 작품이 4월 출시 일정을 미루게 됐다. 아웃바운드는 원래 4월 23일 출시 예정이었으나 5월 14일로 연기됐으며, 헤맨과 마스터스 오브 더 유니버스: 드래곤 펄 오브 디스트럭션은 4월 28일에서 여름으로 일정이 변경됐다.\n\n두 개발팀은 각각 게임을 완성도 높게 선보이기 위해 추가 개발 시간이 필요하다고 밝혔다. 4월에 다수의 우수한 Xbox 인디게임이 예정되어 있었으나, 이번 연기로 라인업에 공백이 생기게 됐다.\n\n게임 개발사들이 품질을 우선시하는 모습은 업계 전반에서 지속되는 추세다. 게이머들은 연기된 두 게임의 최종 모습을 갖춘 버전을 경험할 수 있을 것으로 예상된다.	{Xbox,인디게임,아웃바운드,헤맨,"출시 연기"}	PUBLISHED	2026-04-22 07:42:35.118	2026-04-22 07:42:35.118	0
cmo9qwdhk001dt4sz82o7u2gg	Mario Galaxy Movie Helps Franchise Surpass $2 Billion At Global Box Office	https://www.nintendolife.com/news/2026/04/mario-galaxy-movie-helps-franchise-surpass-usd2-billion-at-global-box-office	2026-04-22 05:35:00	Nintendo Life	Console	Nintendo	fixed	마리오 프랜차이즈 영화, 전 세계 박스오피스 20억 달러 돌파	슈퍼마리오 갤럭시 무비의 성공으로 마리오 영화 시리즈가 20억 달러 돌파 기록	슈퍼마리오 갤럭시 무비가 2026년 최고의 박스오피스 성과를 거두면서 마리오 영화 프랜차이즈가 새로운 역사를 기록했다. 슈퍼마리오 브라더스 무비와 슈퍼마리오 갤럭시 무비를 포함한 마리오 영화 시리즈의 전 세계 박스오피스 수익이 총 20억 달러를 넘어섰다.\n\n마리오 영화 프랜차이즈는 닌텐도의 가장 상징적인 캐릭터를 중심으로 한 영화화 프로젝트의 성공을 증명했다. 슈퍼마리오 갤럭시 무비 단독으로도 2026년의 가장 큰 흥행작으로 자리잡으면서 원본 게임 시리즈의 인기를 영화 시장에서도 재현해냈다.\n\n이는 게임 IP의 영화화가 전 세계 관객들에게 얼마나 강력한 어필력을 지니는지 보여주는 사례다. 닌텐도는 마리오 프랜차이즈의 영화적 확장을 통해 게임을 초월한 미디어 엔터테인먼트 기업으로서의 입지를 더욱 공고히 했다.	{마리오,영화,닌텐도,박스오피스}	PUBLISHED	2026-04-22 07:42:42.248	2026-04-22 07:42:42.248	0
cmo9qwj0q001et4sz4bzzrplz	Reminder: Vampire Crawlers: The Turbo Wildcard From Vampire Survivors Out Now For Switch 1 & 2	https://www.nintendolife.com/news/2026/04/reminder-vampire-crawlers-the-turbo-wildcard-from-vampire-survivors-out-now-for-switch-1-and-2	2026-04-22 03:45:00	Nintendo Life	Console	Nintendo	fixed	뱀파이어 서바이버스 세계관의 턴제 카드게임, 닌텐도 스위치에 출시	뱀파이어 크롤러즈가 스위치에 정식 공개, 원작의 세계를 턴제 덱빌더로 재해석	뱀파이어 서바이버스의 개발사 Poncle이 선보인 신작 '뱀파이어 크롤러즈: 뱀파이어 서바이버스의 터보 와일드카드'가 닌텐도 스위치 1, 2에서 정식으로 플레이 가능해졌다. 원작의 빠른 속도감과 중독성 있는 게임플레이를 완전히 다른 장르로 변환한 이 작품은 턴제 방식의 카드 게임으로, 로그라이트 요소를 결합했다.\n\n게임은 플레이어가 덱을 직접 구성하고 익숙한 맵을 새로운 관점에서 탐색하는 전략적 경험을 제공한다. 원작에서 구축했던 눈덩이처럼 불어나는 흥미로운 시스템이 이번작에서는 카드의 조합을 통해 '세상을 멸망시킬' 정도의 강력한 콤보를 만드는 방식으로 재구현되었다.\n\n뱀파이어 서바이버스의 열성 팬들은 이 새로운 해석을 통해 익숙한 세계관을 완전히 다른 게임플레이로 경험할 수 있다. 덱빌딩과 전술적 의사결정이 중심이 되는 본작은 원작과 차별화되면서도 그 정신을 이어가는 작품으로 평가받을 수 있을 것으로 보인다.	{"뱀파이어 서바이버스","턴제 카드게임","닌텐도 스위치"}	PUBLISHED	2026-04-22 07:42:49.417	2026-04-22 07:42:49.417	0
cmo9qwn1x001ft4szad00rcma	Ratatan Is Getting A Proper Physical Release On Switch 2, Pre-Orders Live	https://www.nintendolife.com/news/2026/04/ratatan-is-getting-a-proper-physical-release-on-switch-2-pre-orders-live	2026-04-22 01:55:00	Nintendo Life	Console	Nintendo	fixed	리듬 로그라이크 라타탄, Switch 2로 정식 출시되며 피지컬 버전도 준비	Switch 취소 후 Switch 2에서 7월 출시, 피지컬 버전 $39.99에 사전 예약 시작	리듬 로그라이크 게임 라타탄이 Switch 2 플랫폼에서 정식 출시될 예정이다. 원래 Nintendo Switch 버전이 취소됐지만, 개발사 라타타 아츠는 Switch 2 버전으로 프로젝트를 계속 진행하기로 결정했다.\n\n이번 출시와 함께 게임의 피지컬 버전이 함께 발매되며, 가격은 $39.99(영국 기준 £39.99)로 책정됐다. 현재 주요 유통사를 통해 사전 예약이 진행 중이다.\n\n라타탄은 리듬 게임의 재미와 로그라이크 요소를 결합한 독특한 장르 혼합 게임으로, Switch 플랫폼에서의 취소 소식 이후 Switch 2로의 발표가 플레이어들에게 기대감을 주고 있다. 게임은 오는 7월 Switch 2에서 출시될 예정이다.	{"Switch 2",라타탄,리듬게임,피지컬발매}	PUBLISHED	2026-04-22 07:42:54.32	2026-04-22 07:42:54.32	0
cmo9qwqs1001gt4szg8ywrmo6	Dragon Ball FighterZ Update 1.50 Now Available For Switch, Here Are The Full Patch Notes	https://www.nintendolife.com/news/2026/04/dragon-ball-fighterz-update-1-50-now-available-for-switch-here-are-the-full-patch-notes	2026-04-22 00:55:00	Nintendo Life	Console	Nintendo	fixed	드래곤볼 파이터즈, 슈퍼 사이언인4 다이마 추가와 함께 1.50 업데이트 배포	드래곤볼 파이터즈가 1.50 업데이트를 공개했으며, 새로운 DLC 캐릭터 손오공(슈퍼 사이언인4 다이마)이 추가됐다.	드래곤볼 파이터즈가 1.50 버전 업데이트를 Nintendo Switch를 포함한 플랫폼에 배포했다. 이번 업데이트와 함께 반다이 남코는 손오공(슈퍼 사이언인4 다이마)을 새로운 유료 DLC 캐릭터로 추가했으며, 해당 캐릭터는 2026년 4월 22일부터 이용 가능하다.\n\n1.50 업데이트는 단순 캐릭터 추가를 넘어 게임 시스템 역학과 기존 캐릭터들을 대상으로 한 광범위한 밸런스 조정을 포함하고 있다. 이는 온라인 게임 플레이의 경쟁력과 다양성을 높이기 위한 조정으로 보인다.\n\n드래곤볼 파이터즈는 지속적인 콘텐츠 추가로 게이머들의 관심을 유지하고 있으며, 새로운 변신 형태의 손오공 추가는 팬들에게 기대할 요소를 제공한다.	{"드래곤볼 파이터즈","Nintendo Switch",DLC}	PUBLISHED	2026-04-22 07:42:59.473	2026-04-22 07:42:59.473	0
cmo9qwvb4001ht4sz1em0bva6	Surprise! Alien: Rogue Incursion Has Shadow-Dropped On Switch 2	https://www.nintendolife.com/news/2026/04/surprise-alien-rogue-incursion-has-shadow-dropped-on-switch-2	2026-04-21 18:00:00	Nintendo Life	Console	Nintendo	fixed	서비로스, '에일리언: 로그 인커션' Switch 2에 기습 출시	에일리언 데이 맞춰 'Alien: Rogue Incursion - Part I: Evolved Edition'이 Switch 2에 공개됐다.	서비로스가 4월 26일 에일리언 데이를 앞두고 'Alien: Rogue Incursion - Part I: Evolved Edition'을 Switch 2에 기습 출시했다. 원래 VR 게임으로 제작되던 이 작품은 기존 콘솔 플레이에 맞게 재설계되었으며, PS4 플랫폼으로의 출시도 예정되어 있다.\n\n플레이어는 에일리언 시리즈의 만화와 소설 확장 우주에서 알려진 캐릭터 줄라 헨드릭스 역할을 담당하게 된다. 이번 출시는 프랜차이즈 팬들을 위한 깜짝 선물로, 에일리언의 상징인 'LV-426' 달과 관련된 특별한 날짜를 택했다.\n\nSwitch 2의 초기 독점 출시로 시작되는 이 게임은 닌텐도의 새로운 하드웨어 라인업에서 대형 IP를 활용한 첫 주요 타이틀 중 하나로 평가된다. 향후 PS4를 포함한 다중 플랫폼 지원 계획은 이 게임의 범용성과 개발사의 콘솔 게임 강화 의도를 보여준다.	{"Switch 2",에일리언,서비로스}	PUBLISHED	2026-04-22 07:43:05.345	2026-04-22 07:43:05.345	0
cmo9qx07p001it4szlvlnf556	Talking Point: So, What Are Your First Impressions Of Splatoon Raiders?	https://www.nintendolife.com/features/talking-point-so-what-are-your-first-impressions-of-splatoon-raiders	2026-04-21 17:00:00	Nintendo Life	Console	Nintendo	fixed	스플래툰 레이더스, 공식 트레일러 공개로 게임플레이 처음 공개	Switch 2 독점작 스플래툰 레이더스가 싱글플레이 중심의 새로운 방향을 제시하며 2026년 7월 23일 출시 예정	Nintendo가 스플래툰 레이더스의 공식 트레일러를 공개하면서 게임의 구체적인 모습이 처음으로 드러났다. 기존 온라인 멀티플레이 중심의 스플래툰 시리즈와 달리 이번 작품은 싱글플레이 캠페인을 핵심으로 삼으며, Switch 2의 독점 타이틀로 2026년 7월 23일에 출시될 예정이다.\n\n이번 트레일러 공개는 지난해 6월 Nintendo가 게임을 처음 발표한 이후 약 11개월 만에 공개되는 첫 번째 게임플레이 영상이다. 그동안 팬들이 게임에 대해 알 수 있었던 정보는 극히 제한적이었던 만큼, 이번 공식 트레일러는 게이머들의 궁금증을 풀 수 있는 중요한 자료가 될 것으로 보인다.\n\n스플래툰 시리즈가 멀티플레이 게임으로 성장한 만큼, 싱글플레이 중심의 신작이 어떤 평가를 받을지 게이머들의 관심이 집중되고 있다. Switch 2 출시 초기의 주요 타이틀로 자리매김할 수 있을지가 성공의 열쇠가 될 것으로 예상된다.	{"스플래툰 레이더스","Switch 2",싱글플레이}	PUBLISHED	2026-04-22 07:43:11.701	2026-04-22 07:43:11.701	0
cmo9qx444001jt4szqls5ru5s	Splatoon Raiders' Switch 2 Price And Box Art Have Been Revealed	https://www.nintendolife.com/news/2026/04/splatoon-raiders-switch-2-price-and-box-art-have-been-revealed	2026-04-21 14:15:00	Nintendo Life	Console	Nintendo	fixed	Nintendo, 스플래툰 레이더스 Switch 2 가격과 패키지 아트 공개	스플래툰 레이더스의 가격과 박스 아트가 공개되었으며, 7월 23일 출시 예정	닌텐도가 오랜 침묵을 깨고 스플래툰 레이더스의 구체적인 정보를 공개했다. 게임의 정식 출시일인 7월 23일을 비롯해 패키지 아트와 함께 공식 가격도 함께 발표되었으며, 연계 아미보 상품도 선보였다.\n\n스플래툰 레이더스는 디지털 버전 기준 £41.99 또는 $49.99에 판매될 예정이며, 물리 패키지는 $59.99의 가격이 책정되었다. 영국 지역의 물리 패키지 가격은 아직 공식 발표되지 않았으나 £49.99 선후로 책정될 것으로 예상된다.\n\n이번 가격 공개로 플레이어들은 디지털과 물리 버전 중 선호하는 방식으로 게임을 준비할 수 있게 되었다. Switch 2로 출시되는 이 신작은 스플래툰 시리즈의 새로운 방향을 제시하는 타이틀로 주목받고 있다.	{"스플래툰 레이더스","Nintendo Switch 2","출시 가격"}	PUBLISHED	2026-04-22 07:43:16.757	2026-04-22 07:43:16.757	0
cmo9qxft3001mt4szfmx16ftu	Splatoon Raiders Is Alive, And It's Out This Summer On Switch 2	https://www.nintendolife.com/news/2026/04/splatoon-raiders-is-alive-and-its-out-this-summer-on-switch-2	2026-04-21 12:55:00	Nintendo Life	Console	Nintendo	fixed	닌텐도, 스플래툰 레이더즈 Switch 2 출시 확정…올 여름 공개	스플래툰 신작 레이더즈가 2026년 7월 23일 Switch 2로 출시된다.	닌텐도가 수개월의 침묵을 깨고 스플래툰 레이더즈의 존재를 공식 확인했다. 닌텐도 투데이를 통해 공개된 새로운 트레일러에서 게임이 2026년 7월 23일 Switch 2로 출시될 예정임을 밝혔다. 싱글플레이 중심으로 설계된 이 작품은 시리즈의 새로운 방향성을 제시할 것으로 보인다.\n\n디지털 버전은 영국에서 £41.99, 미국에서 $49.99의 가격으로 책정됐다. 미국의 물리 버전은 $59.99로 책정되었으며, 영국의 물리 버전 가격은 추후 공개될 예정이다. 스플래툰 레이더즈는 기존 멀티플레이 중심의 시리즈와 달리 싱글플레이 캠페인에 초점을 맞춰 새로운 게임 경험을 제공할 것으로 기대된다.	{스플래툰,"Switch 2",닌텐도}	PUBLISHED	2026-04-22 07:43:31.911	2026-04-22 07:43:31.911	0
cmo9qxju4001nt4szaxpq5u7v	Poll: What Review Score Would You Give Tomodachi Life: Living The Dream?	https://www.nintendolife.com/features/poll-what-review-score-would-you-give-tomodachi-life-living-the-dream	2026-04-21 11:30:00	Nintendo Life	Console	Nintendo	fixed	닌텐도 스위치 출시 '토모다치 라이프: 리빙 더 드림' 평가 투표	스위치로 출시된 '토모다치 라이프: 리빙 더 드림'에 대한 독자 평가 조사	닌텐도 스위치용 '토모다치 라이프: 리빙 더 드림'이 정식 출시되었다. 1년 전부터 개발이 완료된 상태였던 이 게임은 스위치라는 대성공 플랫폼에 출시되면서도 독특하고 괴짜스러운 매력을 여전히 잘 드러내고 있다.\n\n게임의 이상하고 신비로운 특징들이 새로운 플랫폼에서도 훼손되지 않았다는 점이 특징이다. 개발진은 스위치의 광범위한 사용자층을 고려하면서도 작품의 정체성을 충실히 유지하는 데 성공했다.\n\n현재 게이머들 사이에서 이 게임의 완성도에 대한 평가가 나뉘고 있다. 닌텐도 팬들의 관심이 집중되는 가운데, 실제 플레이어들의 진솔한 평가가 주목받고 있다.	{"Nintendo Switch","토모다치 라이프",게임평가}	PUBLISHED	2026-04-22 07:43:37.132	2026-04-22 07:43:37.132	0
cmo9qxn8e001ot4szc4zjdqnb	Ball X Pit's Second Free Content Update Arrives Next Week, Here's What's Included	https://www.nintendolife.com/news/2026/04/ball-x-pits-second-free-content-update-arrives-next-week-heres-whats-included	2026-04-21 10:30:00	Nintendo Life	Console	Nintendo	fixed	Ball X Pit, 다음 주 '섀도우 업데이트' 출시	Ball X Pit이 4월 27일 Nintendo Switch에서 두 번째 무료 업데이트를 공개했다.	중독성 강한 브레이크아웃 로그라이크 게임으로 인기를 얻은 Ball X Pit이 곧 새로운 콘텐츠를 선보인다. 개발사는 4월 27일 Nintendo Switch와 Switch 2를 대상으로 '섀도우 업데이트'를 배포할 예정이다. 이는 1월의 '레갈 업데이트' 이후 공개되는 두 번째 무료 업데이트다.\n\n이번 업데이트는 게임의 핵심 경험을 강화하는 방향으로 진행된다. 개발팀은 플레이어들의 피드백을 반영하여 게임 밸런스와 새로운 요소들을 추가했다.\n\nKenny Sun과 Devolver Digital은 Ball X Pit의 인기에 힘입어 지속적인 업데이트를 계획하고 있다. 정기적인 무료 업데이트를 통해 게임의 생명력을 유지하겠다는 개발진의 의지가 드러난다.	{"Nintendo Switch","Ball X Pit","무료 업데이트"}	PUBLISHED	2026-04-22 07:43:41.535	2026-04-22 07:43:41.535	0
cmo9qxri1001pt4sz2pqjbm51	Toei Company Establishes New Gaming Publishing Brand	https://www.nintendolife.com/news/2026/04/toei-company-establishes-new-gaming-publishing-brand	2026-04-21 09:45:00	Nintendo Life	Console	Nintendo	fixed	도에이 컴퍼니, 게임 퍼블리싱 브랜드 '도에이 게임즈' 신설	영화·방송사 도에이 컴퍼니가 새로운 게임 퍼블리싱 브랜드를 출범하고 멀티플랫폼 진출을 추진한다.	영화와 방송으로 유명한 일본의 대형 엔터테인먼트 기업 도에이 컴퍼니가 게임 산업 진출을 위한 새로운 퍼블리싱 브랜드 '도에이 게임즈'를 공식 출범했다. 1951년 설립된 도에이 컴퍼니는 이번 진출을 기업의 새로운 도전이라 표현하며 게임 사업에 본격적으로 나서기로 했다.\n\n도에이 게임즈는 먼저 Steam에서 게임을 선보인 후 Nintendo Switch, PlayStation, Xbox 등 주요 콘솔 플랫폼으로 점진적으로 확대할 계획을 세웠다. 이러한 단계적 접근 방식은 PC 플랫폼에서의 입지를 먼저 다진 후 콘솔 시장으로의 진입을 노리는 전략으로 보인다.\n\n영상 콘텐츠 제작에서 쌓은 도에이 컴퍼니의 노하우와 브랜드 파워가 게임 업계에 어떤 영향을 미칠지 관심이 집중되고 있다. 애니메이션과 특촬물로 익숙한 도에이의 지적 재산권들이 게임으로 활용될 가능성도 함께 주목되는 상황이다.	{도에이,"게임 퍼블리싱","Nintendo Switch",멀티플랫폼}	PUBLISHED	2026-04-22 07:43:47.065	2026-04-22 07:43:47.065	0
cmo9qxw8q001qt4sz2l3yn6sp	Hideki Kamiya Marks Okami's 20th Anniversary With A Special Message	https://www.nintendolife.com/news/2026/04/hideki-kamiya-marks-okamis-20th-anniversary-with-a-special-message	2026-04-21 08:45:00	Nintendo Life	Console	Nintendo	fixed	오카미 20주년 기념, 히데키 카미야 감독이 팬들에게 전하는 감사 메시지	오카미 20주년을 맞아 히데키 카미야 감독이 특별 메시지를 공개했다.	캡콤이 오카미의 20주년을 기념하는 행사를 개최했고, 게임의 총감독 히데키 카미야가 이 뜻깊은 순간을 함께하기 위해 팬들을 향한 감사의 메시지를 전달했다. 카미야 감독은 "게임이 완성되어 출시된 것을 아직도 믿을 수 없다"는 소감으로 시작해 개발 과정의 감정을 솔직하게 드러냈다.\n\n캡콤의 공식 기념 웹사이트에서는 다양한 축하 행사와 콘텐츠를 확인할 수 있다. 게임 개발에 참여했던 주요 인물들의 손글씨 그림인 시키시 디자인을 감상할 수 있으며, 팬들도 자신만의 메시지를 남겨 오카미 20주년의 의미를 함께 나눌 수 있다.\n\n오카미는 독특한 일본화풍의 그래픽과 창의적인 게임 플레이로 게이머들의 많은 사랑을 받아온 작품이다. 20년이 흐른 지금도 팬들의 지속적인 관심 속에서 이렇게 대규모 기념 행사가 열리는 것은 이 게임이 업계에 남긴 영향력을 보여주는 증거다.	{오카미,닌텐도,기념행사}	PUBLISHED	2026-04-22 07:43:53.211	2026-04-22 07:43:53.211	0
cmo9qy0nn001rt4szecnas9pq	Good Smile Reveals Two Stunning Fire Emblem Figures, Pre-Orders Now Live	https://www.nintendolife.com/news/2026/04/good-smile-reveals-two-stunning-fire-emblem-figures-pre-orders-now-live	2026-04-21 05:55:00	Nintendo Life	Console	Nintendo	fixed	굿스마일, 파이어 엠블럼 피그 2종 공개 및 예약 시작	굿스마일 컴퍼니가 파이어 엠블럼 페이트의 아즈라 피규어 2종을 선공개하고 예약을 시작했다.	굿스마일 컴퍼니가 닌텐도의 인기 시리즈 파이어 엠블럼을 주제로 한 고급 피규어 2종을 공개했다. 3DS 타이틀 파이어 엠블럼 페이트의 인기 캐릭터 아즈라를 모델로 제작된 이들 피규어는 정교한 디테일과 생동감 있는 표현이 특징이다.\n\n두 피규어는 각각 다른 콘셉트로 아즈라의 매력을 표현하고 있으며, 현재 굿스마일의 공식 채널을 통해 예약 판매가 진행 중이다. 피규어 컬렉터들의 높은 관심을 반영하여 판매 수량이 제한될 것으로 예상된다.\n\n닌텐도가 신작 파이어 엠블럼 포춘스 위브로 시리즈의 미래에 집중하고 있는 가운데, 굿스마일의 이번 제품 출시는 과거 작품에 대한 팬들의 애정을 반영한 선택이다. 파이어 엠블럼 시리즈는 캐릭터 인기도가 높아 피규어나 굿즈 제작 대상으로 꾸준히 주목받고 있다.	{"파이어 엠블럼",굿스마일,피규어}	PUBLISHED	2026-04-22 07:43:58.932	2026-04-22 07:43:58.932	0
cmo9qy5ms001st4sz014gqy39	THQ Nordic Website Lists Multiple Unannounced Projects For Switch 2	https://www.nintendolife.com/news/2026/04/thq-nordic-website-lists-multiple-unannounced-projects-for-switch-2	2026-04-21 03:55:00	Nintendo Life	Console	Nintendo	fixed	THQ Nordic, Switch 2용 미공개 프로젝트 다수 준비 중	THQ Nordic이 Switch 2 플랫폼을 위해 여러 미발표 게임을 개발 중인 것으로 확인됐다.	THQ Nordic이 Nintendo Switch 2용으로 현재까지 공개하지 않은 프로젝트들을 다수 진행 중인 것으로 드러났다. 퍼블리셔의 공식 웹사이트에서 확인된 이 정보는 Switch 2 출시 후 THQ Nordic이 얼마나 광범위한 지원을 계획하고 있는지 보여주는 단서가 되고 있다.\n\n지난달 몇몇 게임이 이미 Switch 2용으로 발표되었으나, THQ Nordic의 파이프라인에는 아직 공개되지 않은 타이틀들이 더 있는 것으로 보인다. 이는 Nintendo의 차세대 하이브리드 콘솔이 출시된 후 지속적인 소프트웨어 공급을 받을 수 있다는 긍정적인 신호다.\n\nTHQ Nordic은 이전 Nintendo 플랫폼에서도 꾸준한 게임 공급을 이어온 주요 퍼블리셔로, Switch 2에서도 유사한 패턴을 따를 것으로 예상된다. 정식 발표 시점은 아직 미정 상태다.	{"THQ Nordic","Nintendo Switch 2","게임 개발"}	PUBLISHED	2026-04-22 07:44:05.38	2026-04-22 07:44:05.38	0
cmo9qyas2001tt4szvvfmuf0z	Sanrio Party Land Announced For Switch 1 & 2, More Sanrio Games Teased	https://www.nintendolife.com/news/2026/04/sanrio-party-land-announced-for-switch-1-and-2-more-sanrio-games-teased	2026-04-21 02:55:00	Nintendo Life	Console	Nintendo	fixed	샌리오, Nintendo Switch 1·2용 신작 '샌리오 파티 랜드' 발표	샌리오가 새로운 게임 브랜드를 통해 Switch 향 파티 게임을 공개하고 3년간 약 10개 타이틀 출시 계획을 밝혔다.	샌리오가 신설 게임 브랜드 '샌리오 게임즈'를 통해 Nintendo Switch와 Switch 2를 지원하는 신작 '샌리오 파티 랜드'를 공식 발표했다. 이는 캐릭터 IP를 게임으로 확장하려는 샌리오의 첫 번째 자체 출판 게임으로, 다양한 미니게임이 특징인 파티 게임이 될 것으로 보인다.\n\n샌리오는 단순히 하나의 게임에 그치지 않고 더욱 야심 찬 계획을 준비 중이다. 앞으로 3년간 약 10개의 신작 타이틀을 순차적으로 선보일 예정이며, 추가 샌리오 게임들에 대한 정보도 추후 공개될 계획이다.\n\n팬덤이 두터운 샌리오 캐릭터들의 게임화는 아동층과 캐주얼 게이머들을 공략하는 전략으로 해석된다. Nintendo의 이용자 기반이 두터운 플랫폼을 선택한 만큼, 샌리오는 게임 시장에서 새로운 수익원을 확보하려는 의도로 보인다.	{"Nintendo Switch",샌리오,"파티 게임","신작 발표"}	PUBLISHED	2026-04-22 07:44:12.05	2026-04-22 07:44:12.05	0
cmo9qyfd1001ut4szzaz2l1l1	Argonaut Games Appears To Bee Reviving A Forgotten N64 Title	https://www.nintendolife.com/news/2026/04/argonaut-games-appears-to-bee-reviving-a-forgotten-n64-title	2026-04-21 01:05:00	Nintendo Life	Console	Nintendo	fixed	아르고노트 게임즈, 20년 잠자던 닌텐도64 게임 '벅 범블' 부활 예고	아르고노트 게임즈가 N64 타이틀 '벅 범블'의 복귀를 암시하는 신비로운 이미지 공개	영국의 개발사 아르고노트 게임즈가 닌텐도64 시대의 잊혀진 게임 '벅 범블'의 부활을 시사했다. 지난주 소셜 미디어를 통해 주인공 벅의 캐릭터 일러스트와 함께 원곡의 게임 테마 음악을 공개한 것으로 보아, 개발사는 이 타이틀에 대한 특별한 프로젝트를 진행 중인 것으로 보인다.\n\n아르고노트 게임즈는 해당 게시물에 "현재로서는 추가 질문에 대한 답변을 드리지 않겠다"는 메시지를 덧붙였다. 이는 프로젝트가 아직 초기 단계이거나 공식 발표 준비 중일 가능성을 시사한다.\n\n'벅 범블'은 1994년 닌텐도64 초기 타이틀로 출시된 3D 슈팅 게임이다. 개발사가 과거 이 게임을 재방문할 계획을 언급한 바 있지만, 실제 프로젝트 진행 소식은 이번이 처음이다. 팬들의 높은 관심과 레트로 게임 복구의 트렌드 속에서 숨겨진 고전의 부활이 현실화될 수 있을 것으로 기대된다.	{닌텐도64,벅범블,아르고노트게임즈,게임복구,클래식게임}	PUBLISHED	2026-04-22 07:44:17.99	2026-04-22 07:44:17.99	0
cmo9qyvw5001wt4szbz4bo6z0	A Surprise Nintendo Pop-Up Store Has Arrived In London	https://www.nintendolife.com/news/2026/04/a-surprise-nintendo-pop-up-store-has-arrived-in-london	2026-04-20 17:30:00	Nintendo Life	Console	Nintendo	fixed	런던 토템넘 코트에 닌텐도 팝업 스토어 등장	런던의 아르고스 매장에 닌텐도 팝업 스토어가 새로 문을 열었습니다.	런던의 토템넘 코트 아르고스 매장에 닌텐도 팝업 스토어가 새로운 모습으로 문을 열었습니다. 플러시 인형부터 게임, Switch 2 콘솔, 액세서리에 이르기까지 다양한 닌텐도 상품을 한곳에서 만날 수 있으며, 온라인에서만 구매할 수 있었던 알라모, 톡킹 플라워, amiibo 같은 한정 아이템도 함께 판매되고 있습니다.\n\n런던은 지난해 말 웨스트필드에 닌텐도 팝업 스토어가 열렸던 데 이어 이번이 두 번째입니다. 오프라인 매장에서 상대적으로 소외되었던 런던이 최근 닌텐도의 관심을 받으면서 팬들의 기대감이 커지고 있습니다.	{Nintendo,팝업스토어,런던,"Switch 2"}	PUBLISHED	2026-04-22 07:44:39.413	2026-04-22 07:44:39.413	0
cmo9qz1en001xt4szkfxe6n2t	Review: ZPF (Switch) - A Unique-Feeling Mega Drive Shooter With Some Switch Issues	https://www.nintendolife.com/reviews/switch-eshop/zpf	2026-04-20 17:00:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch로 즐기는 레트로 슈팅게임 'ZPF', 독특한 매직 드라이브 감성에 플랫폼 최적화 문제	3인 개발팀이 만든 레트로 슈팅게임 'ZPF'가 Nintendo Switch에 출시됐으나 일부 성능 이슈 존재	'ZPF'는 Perry Sessions, Mikael Tillander, Jamie Vance로 구성된 3인 개발팀이 제작한 슈팅게임으로, 메가드라이브 시대의 향수를 현대적으로 재해석한 작품이다. 개발팀은 과거 치과 연습용 NES 데모 게임 'Cavity Destroyer'를 만들던 Sessions와 Vance가 코더 Tillander와 손을 잡고 새로운 프로젝트를 시작했으며, Sessions의 오래된 그래픽 작업물을 활용해 이 게임을 완성했다.\n\n'미래 메탈 판타지'를 표방하는 이 게임은 1993년 PC Engine의 'Lords of Thunder'와 유사한 스타일을 자랑한다. 정교한 슈팅 액션에 판타지 풍의 스케이프와 사이버펑크 요소를 결합한 독특한 비주얼이 특징이며, 초대형 보스 전투와 박진감 넘치는 스테이지 구성으로 레트로 슈팅 팬들의 마음을 사로잡는다.\n\n게임은 2020년 크리스마스에 처음 공개된 후 2023년 플레이어블 데모를 통해 대중에게 선보였다. 하지만 Nintendo Switch 버전에서는 일부 성능 최적화 측면에서 개선이 필요한 것으로 평가되고 있어, 향후 업데이트를 통한 보완이 기대되는 상황이다.	{"Nintendo Switch",슈팅게임,레트로게임,인디게임}	PUBLISHED	2026-04-22 07:44:46.559	2026-04-22 07:44:46.559	0
cmo9qz62i001yt4szh2fz48oh	Assassin's Creed Black Flag Resynced Will Finally Be Revealed This Week	https://www.nintendolife.com/news/2026/04/assassins-creed-black-flag-resynced-will-finally-be-revealed-this-week	2026-04-20 16:45:00	Nintendo Life	Console	Nintendo	fixed	유비소프트, '어쌔신 크리드 블랙 플래그 리싱크드' 공식 공개 이벤트 개최	유비소프트가 23일 어쌔신 크리드 블랙 플래그 리싱크드의 전용 쇼케이스를 개최해 게임플레이와 플랫폼, 출시일을 공개한다.	유비소프트가 '어쌔신 크리드 블랙 플래그 리싱크드'의 정식 공개 이벤트를 개최한다. 4월 23일 오후 5시(영국 시간) / 오후 6시(중앙유럽 시간) / 오전 9시(태평양 시간) / 정오(동부 시간)에 진행될 이번 쇼케이스에서는 게임의 실제 플레이 영상과 함께 정식 플랫폼 정보 및 출시 일정이 밝혀질 것으로 예상된다.\n\n이 이벤트는 리싱크드가 독립적인 발표 자리를 갖는 만큼 상당한 규모의 공개가 이루어질 것으로 보인다. 어쌔신 크리드 프랜차이즈의 대표작 중 하나인 블랙 플래그가 현세대 콘솔용으로 어떻게 재탄생할지가 핵심 관심사다.\n\nSwitch 2에 대한 출시 여부는 아직 명확하지 않은 상태로, 이번 공개 이벤트에서 Nintendo 플랫폼에 대한 공식 입장이 함께 공개될지 주목된다.	{"어쌔신 크리드",리마스터,Nintendo,유비소프트}	PUBLISHED	2026-04-22 07:44:52.602	2026-04-22 07:44:52.602	0
cmo9qza0p001zt4sz5vqoknr3	Tomodachi Life: Living The Dream Was Reportedly Feature-Complete A Year Ago	https://www.nintendolife.com/news/2026/04/tomodachi-life-living-the-dream-was-reportedly-feature-complete-a-year-ago	2026-04-20 16:00:00	Nintendo Life	Console	Nintendo	fixed	토모다치 라이프: 리빙 더 드림, 1년 전에 이미 개발 완료 상태였던 것으로 추정	USK 등급 평가 기록으로 보아 토모다치 라이프 신작이 약 1년 전부터 완성 단계에 있었을 가능성이 제기됐다.	닌텐도의 신작 라이프 시뮬레이션 게임 토모다치 라이프: 리빙 더 드림이 예상보다 훨씬 먼저 개발을 완료했을 가능성이 제기됐다. USK 등급 평가 기록을 분석한 결과, 이 게임이 약 1년 전부터 이미 완성 단계에 있었던 것으로 보인다.\n\n토모다치 라이프: 리빙 더 드림은 출시 이후 무한한 창의성과 다양한 재미 요소로 주목받으며 주말 내내 밈의 주인공이 되었다. 이 게임의 개발 과정에 대한 정보는 게임 커뮤니티에서 지속적인 관심을 받아왔다.\n\n게임 개발의 초기 단계부터 최종 출시까지의 과정은 개발사의 의도와 전략에 따라 결정되는 경우가 많다. 유명 게임 매체의 전문가들은 이번 발견이 닌텐도의 출시 전략과 개발 일정 관리에 대한 흥미로운 통찰을 제공한다고 분석하고 있다.	{"토모다치 라이프","Nintendo Switch","라이프 시뮬레이션"}	PUBLISHED	2026-04-22 07:44:57.721	2026-04-22 07:44:57.721	0
cmo9qxc6v001lt4sz55btykks	Review: Ys Memoire: Revelations In Celceta (Switch) - A Simple Yet Fun Adventure	https://www.nintendolife.com/reviews/nintendo-switch/ys-memoire-revelations-in-celceta	2026-04-21 13:01:00	Nintendo Life	Console	Nintendo	fixed	Ys Memoire: Revelations in Celceta, Switch 독점으로 출시된 액션 어드벤처 게임	Ys 시리즈의 고전작을 Nintendo Switch로 재출시한 'Ys Memoire: Revelations in Celceta'는 단순하지만 즐거운 액션 게임이다.	Ys Memoire: Revelations in Celceta가 Nintendo Switch로 출시되며 시리즈의 또 다른 고전 게임을 현대 플랫폼으로 가져왔다. 주인공 아돌 크리스틴의 모험을 따르는 이 게임은 1993년 슈퍼 패미컴용 Ys IV: Mask of the Sun의 재해석 버전으로, 시리즈 중 네 번째 시간선상의 작품이다.\n\n스토리 측면에서는 시리즈의 다른 작품들보다 강점이 부족하지만, 화려한 전투 시스템과 개성 있는 캐릭터들이 이를 충분히 보완한다. 전형적인 Ys 게임답게 독립적인 스토리로 구성되어 있어 시리즈의 이전 작품들을 플레이하지 않았어도 충분히 즐길 수 있다.\n\n지난해 Ys Memoire: The Oath in Felghana에 이어 올해 출시된 이 게임은 클래식 Ys 타이틀들이 Switch로 점진적으로 이식되는 과정의 일부다. 익숙한 공식 속에서도 새로운 재미를 찾을 수 있는 단순하면서도 중독성 있는 게임으로 평가받고 있다.	{"Ys Memoire","Nintendo Switch","액션 어드벤처","Ys 시리즈"}	PUBLISHED	2026-04-22 07:43:27.223	2026-04-22 07:46:43.588	1
cmo8q42he000m11b58e9bwrnt	키움 DRX, 한진 브리온 상대로 풀세트 접전 끝 신승	lck-match-115548128962906267	2026-04-09 08:00:00	lolesports	Esports	LCK	fixed	키움 DRX, 한진 브리온 상대로 풀세트 접전 끝 신승	4월 9일 LCK 2주 차 경기에서 키움 DRX가 한진 브리온을 2:1로 꺾고 3경기 만의 승리를 거두었다. 현재 키움 DRX는 2승 4패, 한진 브리온은 1승 5패를 기록하고 있다.	4월 9일 한국 표준시 오전 8시 진행된 LCK 2주 차 경기에서 키움 DRX가 한진 브리온을 상대로 풀세트 접전을 펼친 끝 2:1로 승리했다. 양 팀 모두 하위권 전적을 기록하고 있는 상황에서 벌어진 이번 경기는 생존 싸움의 성격을 띠었다.\n\n이번 승리로 키움 DRX는 2승 4패의 전적으로 올라섰다. 한진 브리온은 1승 5패에 머물며 현재 리그에서 최저 승수를 기록 중이다. 풀세트까지 간 접전 경기를 제압한 키움 DRX의 승리는 침체 국면을 벗어나기 위한 중요한 발판이 될 수 있을 것으로 보인다.\n\n양 팀은 이제 리그 중반으로 접어들며 각각 상승세 확보가 시급한 상황이다. 특히 한진 브리온은 승수 확대를 위한 즉각적인 전술 개선이 요구되며, 키움 DRX는 이 승리 모멘텀을 바탕으로 연승 가도에 나서야 할 것으로 예상된다.	{LCK,"키움 DRX","한진 브리온","2:1 승리",BO3,풀세트,"2주 차"}	PUBLISHED	2026-04-21 14:32:55.443	2026-04-22 07:49:24.585	1
cmo8q5o2x000y11b5iievnvya	BNK 피어엑스, 키움 DRX 완파…3주차 승점 경쟁 가열	lck-match-115548128962906223	2026-04-17 08:00:00	lolesports	Esports	LCK	fixed	BNK 피어엑스, 키움 DRX 완파…3주차 승점 경쟁 가열	2026년 4월 17일 LCK 3주차 경기에서 BNK 피어엑스가 키움 DRX를 2:0으로 셧아웃, 양 팀 모두 2승 4패에서 벗어나기 위한 경쟁이 심화되고 있다.	BNK 피어엑스가 2026년 4월 17일 키움 DRX와의 BO3 매치에서 2:0으로 완승을 거두었다. 이번 경기는 두 팀 모두 현재 2승 4패로 동일한 전적을 기록한 상황에서 치러져, 하위권 탈출을 위한 중요한 승점 경쟁이었다.\n\nBNK 피어엑스의 이번 승리는 팀의 현재 전적을 3승 4패로 끌어올리며 순위 경쟁에서 한 발 앞서 나가는 계기가 되었다. 반면 키움 DRX는 패배로 인해 2승 5패에 머물며 하위권 위기가 심화된 상황으로 확인됐다. 양 팀의 승패 차이가 점점 벌어지면서 리그 중반부의 순위 판도가 더욱 역동적으로 변화하고 있다.\n\n향후 BNK 피어엑스는 현재의 상승세를 이어나가며 중위권 진출을 노려야 할 시점이며, 키움 DRX는 연패 기조를 반드시 끊어내야 하는 상황에 직면했다. 3주차를 지나며 하위권 팀들 간의 승점 싸움이 본격화되고 있어, 이후 경기들의 전개가 리그 전체 순위에 큰 영향을 미칠 것으로 예상된다.	{LCK,BNK피어엑스,키움DRX,BO3,2026시즌}	PUBLISHED	2026-04-21 14:34:10.089	2026-04-23 08:32:52.781	1
cmpcivgmt001raa8agon132x9	Poll: Would You Buy an inFAMOUS Collection for PS5?	https://www.pushsquare.com/news/2026/05/poll-would-you-buy-an-infamous-collection-for-ps5	2026-05-17 10:00:00	Push Square	Console	PlayStation	fixed	PlayStation 5, '인페이머스' 클래식 리마스터 컬렉션 개발 중? 국내 PS3 세대 유저들의 기대감 높아져	PS3의 명작 '인페이머스' 시리즈가 PlayStation 5로 리마스터될 가능성이 제기되며, 레트로 게임의 현대적 부활 움직임이 활발해지고 있다. 다만 소니의 공식 발표 전까지 정보의 신빙성은 제한적인 상태다.	PS3 세대를 대표하는 액션 게임 프랜차이즈 '인페이머스'가 PlayStation 5 시대에 부활할 가능성이 업계 내에서 논의되고 있다. 최근 외신 보도에 따르면 소니가 미지정 개발사와 협력해 초대작과 '인페이머스 2'를 PS5용으로 리마스터하는 프로젝트를 진행 중일 수 있다는 주장이 제기됐다. 다만 해당 정보는 단일 소식통을 기반으로 한 것으로, 아직 공식 확인이나 추가 검증이 이루어지지 않은 상태다.\n\n'인페이머스' 시리즈는 오픈월드 액션 게임의 전형으로 평가받았던 PS3 독점작으로, 당시 많은 국내 유저들의 플레이 기억이 있는 명작이다. 현재 이 두 작품을 PS5의 향상된 하드웨어 사양(최대 4K 해상도, 고주사율 지원, 레이 트레이싱 기술 활용)에 맞춰 재개발할 경우, 원본의 게임플레이 본질을 유지하면서도 그래픽 품질과 로딩 시간을 대폭 개선할 수 있다는 장점이 있다. 최근 소니의 'Bluepoint Games' 인수 이후 진행된 '데몬즈 소울' 리메이크의 성공사례는 PS3 클래식의 PS5 이식 가능성을 시사한 바 있다.\n\n소니가 본격적으로 PS3 세대의 고전 게임을 리마스터 라인업으로 추진한다면, Xbox와의 후발주자 입장에서 차별화된 독점 자산을 강화하는 전략으로 해석된다. PlayStation Plus의 Premium 등급에 포함될 가능성도 제기되며, 이는 구독 서비스의 콘텐츠 가치를 한층 높이는 결과로 이어질 수 있다. 다만 현 시점에서 소니는 공식 발표를 하지 않았으므로, 추가 정보 공개를 기다려야 한다.\n\n■ 국내 구매 및 출시 정보\n- **공식 발표 현황**: 아직 소니 공식 발표 없음 (루머 단계)\n- **예상 플랫폼**: PlayStation 5 (독점)\n- **한국어 지원**: 기존 PS3 버전 한글화 여부에 따라 결정될 것으로 예상\n- **구입 방식**: 정식 출시 시 PS5 디지털/물리 매체 또는 PlayStation Plus Premium 포함될 가능성\n- **추가 확인 필요**: 소니의 공식 발표가 있을 때까지 정보 신뢰도 보류 권장	{"PlayStation 5","인페이머스 컬렉션",리마스터,"PS3 클래식",소니,독점작,루머}	PUBLISHED	2026-05-19 11:01:03.605	2026-05-19 11:01:03.605	0
cmpcivooi001saa8af8fykecr	Feature: Going Platinum: I Legit Forgot This Tiny, Unique PS4 Game Exists	https://www.pushsquare.com/features/going-platinum-i-legit-forgot-this-tiny-unique-ps4-game-exists	2026-05-16 19:00:00	Push Square	Console	PlayStation	fixed	PS4 숨은 명작 'Arrog', 플래티넘 트로피 획득자들 사이에서 재조명되는 이유	독립 개발사 작품 'Arrog'가 플레이스테이션 커뮤니티에서 '잊혀진 보석'으로 재평가받으며, 플래티넘 트로피 달성 난이도와 독창적 게임성에 대한 관심이 증가하고 있다.	PS4의 광활한 라이브러리 속에서 잊혀 가던 소규모 인디 타이틀 'Arrog'가 플래티넘 트로피 수집가들 사이에서 재조명되고 있다. 해당 게임은 접근성이 낮아 많은 유저들이 존재 자체를 모쳤던 것으로 알려져 있으며, 플레이스테이션 커뮤니티에서 '의외로 완성도 높은 숨은 작품'으로 재평가받고 있다.\n\n'Arrog'는 독립 개발진으로 제작된 게임으로, 상대적으로 독특한 게임성과 시각적 표현을 특징으로 한다. 플래티넘 트로피 획득 난이도는 중상 수준으로 평가되며, 특정 트로피 조건들이 도전적이어서 수집가들의 주목을 받고 있다. PS4 생명주기 초반에 출시되었음에도 마케팅 부족으로 인해 대중적 인지도를 확보하지 못한 것으로 분석된다.\n\n이러한 '숨은 보석' 재발견 현상은 PlayStation의 방대한 게임 카탈로그 속에서 우수한 인디 타이틀들이 시장 점유율 경쟁에 밀려나는 현실을 반영한다. PS Plus 서비스 확대와 PS4 이후기(後期) 게임 발굴 트렌드가 강해지면서, 과거 미출시작들을 재발견하려는 플레이어들이 늘어나는 추세다. 이는 소니가 지속적으로 강조해온 '독립 개발사 생태계 지원' 정책의 부작용과 보완 과제를 동시에 드러낸다.\n\n**국내 구매 가이드**: 'Arrog'는 PlayStation Store 한국 계정에서 정식으로 구매 가능하며, 현재 약 1만 원대의 저가 타이틀로 판매 중이다. 한글 인터페이스는 미지원이나 조작 중심의 게임성으로 인해 언어 장벽이 낮은 편이다. PS Plus Essential 구독자라면 PS Store 인디 게임 섹션에서 정기적으로 할인 기회를 확인할 것을 권장한다.	{"PlayStation 4",Arrog,"인디 게임","플래티넘 트로피","PS Store","숨은 명작"}	PUBLISHED	2026-05-19 11:01:14.034	2026-05-19 11:01:14.034	0
cmpcivy9d001taa8ao00hh3kv	Forza Horizon 6 Is Available Today With Xbox Game Pass, And Here's What's Coming In Season 1	https://www.purexbox.com/news/2026/05/forza-horizon-6-is-available-today-with-xbox-game-pass-and-heres-whats-coming-in-season-1	2026-05-19 07:00:00	Pure Xbox	Console	Xbox	fixed	Xbox Game Pass, '포르자 호라이즌 6' 첫날 서비스 시작... 시즌 1 콘텐츠 로드맵 공개	플레이그라운드 게임즈의 신작 레이싱 게임 '포르자 호라이즌 6'이 Xbox Game Pass Ultimate에 첫날 포함되어 출시되었으며, 일본 배경의 개방형 레이싱 경험과 함께 시즌 1 페스티벌 플레이리스트 및 카 패스 상세 내용이 공개됐다.	포르자 호라이즌 6(Forza Horizon 6)이 전 세계 모든 플랫폼에서 정식 출시되며 Xbox Game Pass Ultimate에 첫날 입성했다. 플레이그라운드 게임즈의 신작 레이싱 게임은 유료 조기 접근 기간을 거쳐 일반 공개되었으며, 구독 서비스 가입자라면 추가 비용 없이 즉시 플레이 가능하다. 일본을 배경으로 한 개방형 월드에서 다양한 자동차 레이싱을 즐길 수 있는 타이틀로, Xbox 에코시스템의 주요 첫날 Game Pass 진출작으로 자리 잡았다.\n\n시즌 1은 플레이그라운드가 공식 명칭으로 사용하는 첫 번째 포스트 런칭 콘텐츠 시리즈다. 페스티벌 플레이리스트(Festival Playlist)와 카 패스(Car Pass)가 주요 골자로, 게임 내 진행도와 직결된 정기 챌린지 및 신규 차량 확보 경로를 제시한다. 마이크로소프트의 Game Pass Ultimate 전략이 AAA급 대작 초기 수익성보다 구독자 확보에 무게를 두고 있음을 보여주는 사례로, 플랫폼 홀더의 'Day One Game Pass' 정책이 지속적으로 강화되는 중이다.\n\n포르자 호라이즌 6의 Game Pass 첫날 출시는 Xbox의 성수기 라인업 강화 전략의 일환이다. 구독 서비스 매력도를 높여 Xbox Game Pass 가입자층 확대를 노리는 마이크로소프트의 의도가 반영됐으며, PS Plus 프리미엄과의 경쟁 구도에서 Xbox의 차별화 포인트로 작동할 것으로 예상된다. 시즌 1 콘텐츠 로드맵은 장기적 플레이 동기 부여와 함께 카 패스 구매 유도를 병행하는 구조다.\n\n국내 출시 가격은 Xbox Game Pass Ultimate 월 정액 구독(약 11,900원)으로 접근 가능하며, 스탠다드 에디션 별도 구매 시 59,900원대 예상(플랫폼별 상이)이다. 한국어 자막 및 음성 지원 여부는 플레이그라운드의 추가 공식 발표 대기 중이나, 포르자 시리즈의 역대 한국어 지원 기조상 자막 지원은 높은 확률로 예상된다. Xbox One/Series X|S 및 PC(Windows 11, Xbox Game Pass for PC)에서 즉시 플레이 가능하다.	{"Xbox Game Pass","포르자 호라이즌 6","레이싱 게임","Day One Game Pass","시즌 콘텐츠"}	PUBLISHED	2026-05-19 11:01:26.449	2026-05-19 11:01:26.449	0
cmo9qx7zf001kt4sz9e7pnjcr	A Trio Of New Splatoon amiibo Are On The Way	https://www.nintendolife.com/news/2026/04/a-trio-of-new-splatoon-amiibo-are-on-the-way	2026-04-21 13:15:00	Nintendo Life	Console	Nintendo	fixed	닌텐도, 스플래툰 레이더스 출시에 맞춰 새 amiibo 3종 공개	스플래툰 레이더스 출시일 7월 23일 확정, 신규 amiibo 3종 동시 발매	닌텐도가 스플래툰 레이더스의 정확한 출시일을 공개하며 동시에 게임과 함께 출시될 새로운 amiibo 라인업을 발표했다. 시버, 프라이, 빅맨의 스플래툰 레이더스 에디션 amiibo가 7월 23일 게임과 함께 출시될 예정이다.\n\n이 세 캐릭터는 스플래툰 시리즈의 주요 인물들로, amiibo 컬렉터들과 게임 팬들 사이에서 높은 기대감을 모으고 있다. 새로운 에디션 amiibo는 기존 피규어와는 다른 레이더스 테마의 디자인으로 제작될 것으로 보인다.\n\n닌텐도는 이번 amiibo 발표를 통해 스플래툰 레이더스에 대한 기대감을 지속적으로 불태우고 있다. 신작이 여름에 출시되면서 게임과 피규어를 함께 구매하는 팬들의 반응이 주목된다.	{"스플래툰 레이더스","Nintendo amiibo",닌텐도}	PUBLISHED	2026-04-22 07:43:21.772	2026-04-30 06:08:18.332	1
cmpciw7u4001uaa8a6nt8txuq	Xbox Fans Share Their Top 10 Requests After Day One Of Player Voice Feedback	https://www.purexbox.com/news/2026/05/xbox-fans-share-their-top-10-requests-after-day-one-of-player-voice-feedback	2026-05-18 23:15:00	Pure Xbox	Console	Xbox	fixed	Xbox Player Voice 첫날 결과 공개... '독점작 강화' 최우선 과제로 부상	마이크로소프트의 신규 피드백 시스템 'Xbox Player Voice'가 공식 출범한 지 24시간 만에 유저들의 진짜 바람이 드러났다. 독점작 라인업 확대가 압도적 1위를 차지했으며, 하위호환성 확대와 온라인 멀티플레이 무료화가 뒤를 이었다.	마이크로소프트가 MS 피드백 포털(Feedback Portal)을 통해 공식 론칭한 'Xbox Player Voice' 시스템이 첫날부터 팬덤의 진심을 드러냈다. 투표 수로 집계된 상위 10개 요청사항 중 압도적 1위는 '독점작 게임 라인업 강화'였으며, 이는 현세대 Xbox 생태계의 가장 큰 약점으로 지목돼온 쟁점이다. 소니의 PlayStation 5가 '고스트 오브 쓰시마 2', '파이널판타지 7 리메이크 인터그레이드' 등 AAA급 독점작으로 입지를 다지는 상황에서, Xbox 커뮤니티가 집단적으로 목소리를 높인 것으로 풀이된다.\n\n상위권 요청사항을 세부 분석하면, '더 많은 하위호환성 타이틀 추가'가 2위, '온라인 멀티플레이 게임 무료화'가 3위로 나타났다. 특히 하위호환성 요청은 Xbox Series X|S 세대로의 전환 과정에서 이전 세대(Xbox One, Xbox 360, 원본 Xbox) 게임들의 접근성 확대를 원하는 유저들의 염원을 반영한 것으로 보인다. 온라인 멀티플레이 무료화 요청은 PlayStation Plus의 멀티플레이 유료화 정책 논란과 맞물려, Game Pass 구독자들도 추가 비용 없이 온라인 게임을 즐기길 바라는 구체적 불만으로 해석된다.\n\n이번 Player Voice 시스템 개설은 Xbox 팬덤과의 소통 강화 의지로 평가되지만, 동시에 Microsoft의 전략적 약점을 노출시킨 셈이다. 특히 독점작 부족 문제는 2023년 ABK(Activision Blizzard) 인수 이후에도 해결되지 못한 숙제로, 차기 보도 자료나 E3 유사 이벤트에서 신작 공개 계획이 얼마나 구체적일지가 주목된다. Microsoft가 이 피드백을 실제 로드맵에 반영할 경우, 현재 PlayStation 중심으로 기울어진 국내 콘솔 시장의 밸런스 변화를 촉발할 가능성도 있다.\n\n**국내 유저 가이드**: Xbox Player Voice 시스템은 전 세계 사용자에게 개방되어 있으며, MS 계정만 있으면 누구나 피드백 포털에 접속해 투표 및 제안에 참여할 수 있다. 국내에서는 Xbox Game Pass for Console 구독자(월 10,900원부터)들이 주요 대상이며, 향후 Microsoft가 반영하는 피드백 중 한국어 자막 지원, 한국 지역 가격 조정 등의 로컬화 요청이 추가될 가능성이 높다.	{Xbox,"Xbox Player Voice",독점작,하위호환성,"Game Pass",커뮤니티피드백}	PUBLISHED	2026-05-19 11:01:38.86	2026-05-19 11:01:38.86	0
cmpciwhao001vaa8acc89vlv5	Microsoft Announces Fan Feedback Program 'XBOX Player Voice', And It's Now Live	https://www.purexbox.com/news/2026/05/microsoft-announces-fan-feedback-program-xbox-player-voice-and-its-now-live	2026-05-18 19:45:00	Pure Xbox	Console	Xbox	fixed	Xbox, 공식 피드백 플랫폼 'Xbox Player Voice' 오픈... 유저 의견 개발에 직접 반영	마이크로소프트가 Xbox 플레이어들의 의견을 체계적으로 수집·반영하는 'Xbox Player Voice' 플랫폼을 공식 출시했으며, 이는 아샤 샤르마 신임 Xbox 대표의 커뮤니티 중심 경영 방침을 구체화한 것으로 평가된다.	마이크로소프트가 Xbox 유저들의 목소리를 직접 수렴하는 공식 피드백 플랫폼 'Xbox Player Voice'를 정식 오픈했다. Xbox Wire를 통해 공식 발표된 이번 프로그램은 플레이어들이 Xbox 및 Game Pass의 향후 방향성에 대해 의견을 제시하고, 이러한 의견들이 개발팀에 가시적으로 전달되도록 설계된 포럼 형식의 플랫폼이다. 이는 게임 업계에서 메이저 콘솔 제조사가 공식적으로 운영하는 피드백 시스템 중 가장 체계화된 사례로, 커뮤니티 의견을 제품 개발 로드맵에 반영하겠다는 신호다.\n\n플랫폼의 주요 기능은 다음과 같다. 유저들은 Xbox 하드웨어(Xbox Series X|S), Game Pass 라인업, Xbox Live 기능 등 광범위한 분야에서 아이디어를 제안하고 투표할 수 있으며, 각 피드백의 지지도가 시각적으로 표시돼 가장 수요가 높은 의견이 개발팀의 우선순위가 되는 방식이다. 이러한 구조는 PlayStation과 Nintendo Switch 대비 Xbox가 개발 투명성에서 한 발 더 나아갈 수 있는 차별화 포인트가 될 것으로 보인다.\n\n신임 Xbox 대표 아샤 샤르마는 취임 이후 '플레이어 중심의 Xbox'를 핵심 메시지로 제시해왔으며, 이번 Player Voice 플랫폼은 그 전략의 첫 번째 구체적 실행안이다. Game Pass 구독 수의 정체, AAA 독점작 부재 등으로 인한 플레이어 이탈을 방지하고자 커뮤니티와의 직접적인 대화 채널을 강화하는 차원이다. 특히 한국을 포함한 아시아 지역에서도 Xbox 사용자층이 확대되는 중인 만큼, 이번 플랫폼이 글로벌 유저 기반 확대의 촉매가 될 수 있을 것으로 기대된다.\n\n**국내 유저를 위한 주요 정보:**\n- **접근성**: Xbox Player Voice는 Xbox.com 공식 사이트에서 무료로 접속 가능하며, Xbox 계정 로그인으로 즉시 이용할 수 있다.\n- **한국어 지원**: 현재 영문 기반으로 운영되나, 마이크로소프트는 향후 다국어 지원 확대를 검토 중인 것으로 알려졌다.\n- **참여 방식**: 아이디어 제안(Idea), 피드백 투표(Vote), 토론(Discussion) 세 가지 형식으로 참여 가능하며, 가장 지지도가 높은 항목은 Xbox 공식 개발 로드맵에 우선 반영될 예정이다.\n- **주요 피드백 대상**: Game Pass 신규 게임 확대, 레이 트레이싱 성능 개선, Xbox Live 기능 개선, BC(하위호환성) 게임 추가 등이 주요 투표 대상이다.	{Xbox,"Xbox Player Voice","커뮤니티 피드백","아샤 샤르마","Game Pass","소프트웨어 전략"}	PUBLISHED	2026-05-19 11:01:51.119	2026-05-19 11:01:51.119	0
cmpciwq6t001waa8alweodbng	Feature: Xbox Invited Us To A Real Forza Horizon Festival, And There's Another One This Weekend	https://www.purexbox.com/features/xbox-invited-us-to-a-real-forza-horizon-festival-and-theres-another-one-this-weekend	2026-05-18 18:30:00	Pure Xbox	Console	Xbox	fixed	Xbox, '포르자 호라이즌 6' 출시 기념 실제 페스티벌 개최... 국내 출시 임박 앞두고 글로벌 마케팅 전개	Xbox가 영국에서 포르자 호라이즌 6 출시를 기념한 오프라인 페스티벌을 개최했으며, 이번 주말에도 추가 이벤트를 예정 중. 시뮬레이터 리그부터 일반 TV 플레이까지 다양한 플랫폼에서 게임을 직접 체험하게 한 결과, 게이머뿐 아니라 일반 대중 사이에서도 높은 호평을 받았다.	Xbox UK가 포르자 호라이즌 6의 글로벌 출시를 기념하여 영국 스트랫포드어폰에이번의 카페인 & 머신 스튜디오에서 공개 페스티벌을 개최했다. 이날 행사는 게이밍 애호가뿐 아니라 자동차 문화와 캐주얼한 게임 경험을 즐기려는 일반인까지 참여했으며, 실시간으로 포르자 호라이즌 6을 플레이하고 게임 내 차량을 촬영하는 등의 활동이 이루어졌다. 이는 단순한 게임 출시 이벤트를 넘어 Xbox의 라이프스타일 브랜드 포지셔닝을 강화하는 전략으로 평가된다.\n\n행사에서 주목할 점은 플레이 환경의 다층적 구성이다. 일반 TV 모니터부터 고사양 레이싱 시뮬레이터 리그까지 다양한 플랫폼을 배치함으로써, 일반 게이머부터 하드코어 시뮬레이션 애호가까지 모두를 아우르는 게임의 접근성을 직관적으로 보여줬다. 특히 포르자 호라이즌 6이 Xbox Series X|S, PC, 클라우드 게이밍 등 Xbox 에코시스템 전반에서 구동 가능하다는 점을 현장에서 직접 체험하게 한 점이 마케팅 효과를 극대화했다.\n\n이러한 오프라인 페스티벌 전개는 Xbox Game Pass와의 시너지 창출을 염두에 둔 전략으로 보인다. 포르자 호라이즌 6이 Game Pass에 포함됨에 따라, 구독자뿐 아니라 잠재 고객들에게 게임의 가치를 직접 경험시키는 것이 출시 초 유저 확보에 유리하기 때문이다. 또한 본 행사가 주말에 공개되어 높은 발길을 끌었던 만큼, 추가 개최 예정인 이번 주말 이벤트도 유사한 관심을 집중시킬 것으로 예상된다.\n\n현재 포르자 호라이즌 6은 Xbox Series X|S, PC, 클라우드 게이밍으로 출시되었으며, 국내에서는 Xbox Game Pass Ultimate 구독자들이 서비스 출시 직후부터 플레이 가능하다. 한국어 자막은 완벽하게 지원되며, 정식 구매 가격은 표준판 기준 약 80,000원대로 책정되었다. 현재 Microsoft Store, Amazon, 주요 소매점에서 구매 가능하며, Xbox Game Pass를 통한 접근이 가장 경제적인 방안이다.	{Xbox,"포르자 호라이즌 6","게임 마케팅","Xbox Game Pass","콘솔 출시"}	PUBLISHED	2026-05-19 11:02:02.646	2026-05-19 11:02:02.646	0
cmpciwxiz001xaa8aefoos8q3	Poll: What Do You Think Of Subnautica 2 On Xbox Game Pass?	https://www.purexbox.com/features/poll-what-do-you-think-of-subnautica-2-on-xbox-game-pass	2026-05-18 17:00:00	Pure Xbox	Console	Xbox	fixed	Xbox Game Pass Ultimate, 심해 탐험 게임 '서브너티카 2' 즉시 플레이 가능... 유저 반응은 '긍정적'	Xbox Game Pass Ultimate 구독자들이 '서브너티카 2'를 무제한 플레이할 수 있게 됐으며, 개발 난항에도 불구하고 출시 시점 유저 평가는 호의적인 것으로 나타났다.	'서브너티카 2'가 Xbox Game Pass Ultimate에 정식 추가되면서 구독 서비스의 가치를 한층 강화했다. 지난주 '포르자 호라이즌 6'의 출시 소식에 묻혀 큰 주목을 받지 못했지만, 개발 과정에서 여러 논란을 겪었던 만큼 예정된 출시 시점을 맞춰 게임이 공개된 것 자체가 관계자들의 노력이 결실을 맺은 사례로 평가된다.\n\n게임 커뮤니티 내에서는 '서브너티카 2'의 완성도에 대해 전반적으로 긍정적인 반응을 보이고 있다. 심해 탐험 생존 게임이라는 장르적 특성상 Xbox Series X|S의 고성능 GPU를 활용한 수중 환경 렌더링과 실시간 물리 연산이 주요 평가 포인트로 꼽히는 상황이다. 다만 게임의 이용약관(EULA) 일부 문구에 대한 사용자들의 지적이 발생했으나, 이는 출시 후 패치를 통해 개선될 것으로 예상된다.\n\n마이크로소프트가 Game Pass 구독자에게 즉시 플레이할 수 있도록 대작 타이틀을 제공하는 전략은 구독 서비스의 경쟁력을 높이는 핵심 방침이다. 특히 '포르자 호라이즌 6'에 이어 '서브너티카 2'까지 연이어 출시됨으로써, 올상반기 Xbox 플랫폼의 신작 라인업이 상당히 탄탄해졌음을 의미한다. 이는 PlayStation Plus와의 구독 서비스 경쟁에서 마이크로소프트의 적극적인 입지 강화 신호로 해석된다.\n\n**한국 플레이어 가이드**: '서브너티카 2'는 현재 Xbox Game Pass Ultimate 구독 시 추가 비용 없이 즉시 플레이 가능하다(Game Pass Ultimate 월 12,900원). 한국어 자막 및 음성 지원 여부는 공식 확인 필요하며, Xbox Series X|S 기준 최대 성능 플레이 권장한다. PC 버전도 Game Pass for PC에 포함되어 있다.	{Xbox,"Xbox Game Pass","서브너티카 2","생존 게임","구독 서비스"}	PUBLISHED	2026-05-19 11:02:12.155	2026-05-19 11:02:12.155	0
cmpcix63n001yaa8aaq6jn5mm	'Xbox Presents' Was The Most-Viewed Livestream Ever On Xbox's YouTube Channel, And By Some Distance	https://www.purexbox.com/news/2026/05/xbox-presents-was-the-most-viewed-livestream-ever-on-xboxs-youtube-channel-and-by-some-distance	2026-05-18 16:00:00	Pure Xbox	Console	Xbox	fixed	Xbox Presents, 유튜브 라이브스트림 사상 최대 규모 성공... 1,200만 뷰 돌파	마이크로소프트의 새로운 쇼 포맷 'Xbox Presents'가 공식 유튜브 채널 사상 최고 조회수(1,200만 뷰)를 기록하며, 기존 E3 쇼를 압도적으로 제치고 플랫폼 홀더의 직접 커뮤니케이션 전략 변화를 보여줬다.	마이크로소프트가 이달 초 선보인 신규 쇼 포맷 'Xbox Presents'가 공식 유튜브 채널 사상 최대 조회수를 기록했다. 공식 발표에 따르면 해당 라이브스트림은 현재 1,200만 뷰를 돌파했으며, 초기 집계 당시 750만 뷰에서 지속적으로 상승 중인 상황이다. 이는 과거 E3 쇼 기간의 조회수를 상당한 격차로 따돌린 성과로, Xbox 커뮤니티의 참여도가 얼마나 높은지를 단적으로 보여준다.\n\n특히 주목할 점은 이 수치가 기존의 대규모 게임쇼 중심의 발표 방식에 대한 플랫폼 홀더의 전략 전환을 반영한다는 것이다. E3의 축소·폐지 이후 소니, 마이크로소프트, 닌텐도가 각자의 독립적인 발표회를 추진해온 가운데, Xbox Presents는 보다 소규모하면서도 집중력 높은 콘텐츠 공개 방식으로 전환했음을 시사한다. 유튜브 라이브스트림이라는 접근성 높은 플랫폼을 활용하면서도 높은 시청률을 기록한 것은, 게이머들이 거대 행사보다는 '실질적인 게임 정보'에 더욱 반응한다는 점을 증명해준다.\n\n이러한 성과는 향후 Xbox의 콘텐츠 공개 전략에도 직결될 전망이다. 마이크로소프트는 Game Pass 구독자 저변 확대와 함께 소비자 직접 접근의 중요성을 더욱 강화할 가능성이 높으며, 유사한 포맷의 이벤트를 정기적으로 추진할 것으로 예상된다. 특히 국내 Xbox 게이머들도 공식 유튜브 채널을 통해 동시에 접근 가능하다는 점에서, 지역별 시차 없이 글로벌 정보를 실시간 수령할 수 있는 이점이 강화되고 있다.\n\n현재 Xbox Presents는 유튜브 검색이나 Xbox 공식 채널('Xbox')에서 다시보기로 접근 가능하며, 한국어 자막 지원 여부는 개별 영상마다 상이하므로 채널에서 확인이 필요하다. 향후 정기 개최 일정은 공식 발표 시까지 대기 중이다.	{Xbox,"Xbox Presents","유튜브 라이브스트림","플랫폼 전략",게임쇼}	PUBLISHED	2026-05-19 11:02:23.267	2026-05-19 11:02:23.267	0
cmpcixg4c001zaa8a1qo6onoe	Xbox Execs Congratulate Forza Horizon 6 Dev On 'Exceptionally Rare' Success	https://www.purexbox.com/news/2026/05/xbox-execs-congratulate-forza-horizon-6-dev-on-exceptionally-rare-success	2026-05-18 15:00:00	Pure Xbox	Console	Xbox	fixed	Xbox 경영진이 축하한 '포르자 호라이즌 6'의 이례적 성공... Game Pass 출시 앞두고 사전 호평 확대	포르자 호라이즌 6이 정식 출시 전 얼리 액세스 단계에서 수십만 명의 플레이어와 전문가 호평을 기록하자, Xbox CEO 아샤 샤르마와 최고 콘텐츠 책임자 매트 부티가 개발사 플레이그라운드 게임즈를 공개 축하했다. Game Pass 출시를 앞둔 강력한 신호.	포르자 호라이즌 시리즈의 최신작이 정식 출시 전 얼리 액세스 단계에서 '이례적 수준'의 초기 성과를 거두자, Xbox 경영진이 직접 축하의 뜻을 밝혔다. 아샤 샤르마 Xbox CEO와 매트 부티 최고 콘텐츠 책임자는 주말 소셜 미디어를 통해 플레이그라운드 게임즈 개발팀의 성공을 공개적으로 인정했으며, 이는 게임이 Xbox Game Pass로 출시되기 직전 매우 이례적인 경영진 레벨의 축하 제스처로 평가된다.\n\n현재 포르자 호라이즌 6은 스탠다드 에디션 정식 출시 전이지만, 얼리 액세스를 통해 이미 수십만 명 규모의 플레이어가 게임을 체험하고 있으며 주요 미디어 매체로부터 높은 평점을 받았다. 이는 Xbox의 차세대 AAA 타이틀이 초기 수요와 평가 측면에서 강한 모멘텀을 갖추고 있음을 시사한다. 특히 Game Pass 독점 출시 타이틀로서 구독자 확대에도 긍정적 영향을 줄 것으로 예상되는 상황이다.\n\n이러한 경영진 차원의 공식 축하는 Xbox의 Game Pass 전략이 고품질 AAA 게임 확보에 얼마나 전략적으로 집중하고 있는지를 보여주는 사례다. 포르자 호라이즌 시리즈는 Xbox의 핵심 프랜차이즈로, 이번 6편의 얼리 액세스 성공은 Game Pass 구독자 유지 및 신규 가입자 유입을 위한 강력한 콘텐츠 자산으로 기능할 가능성이 높다.\n\n포르자 호라이즌 6은 현재 Xbox Series X|S와 PC에서 Game Pass를 통해 정식 출시를 앞두고 있으며, 한국어 자막 지원 확인 필요. 스탠다드 에디션의 정확한 출시 시점과 국내 가격대는 Xbox Korea 공식 채널을 통해 추가 공지될 예정이다. Game Pass 구독자는 출시일부터 별도 구매 비용 없이 플레이 가능하다.	{Xbox,"Xbox Game Pass","포르자 호라이즌 6","플레이그라운드 게임즈","AAA 게임","하드웨어-소프트웨어 전략"}	PUBLISHED	2026-05-19 11:02:34.819	2026-05-19 11:02:34.819	0
cmpcixn8u0020aa8aooxzag6q	Roundup: Here's What The Reviews Are Saying About LEGO Batman: Legacy Of The Dark Knight	https://www.purexbox.com/news/2026/05/roundup-heres-what-the-reviews-are-saying-about-lego-batman-legacy-of-the-dark-knight	2026-05-18 13:30:00	Pure Xbox	Console	Xbox	fixed	Xbox 얼리 액세스로 출시된 '레고 배트맨: 레거시 오브 더 다크 나이트', 평론가들 호평 '8/10 그레이트' 평가	레고 배트맨 신작이 Xbox 얼리 액세스 프로그램을 통해 공개되며 평론가들로부터 8/10 호평을 받았다. 포르자 호라이즌 6과 동시 출시되는 이 타이틀은 클래식 레고 게임의 매력을 계승한 것으로 평가된다.	Microsoft의 Game Pass 구독 서비스를 통해 얼리 액세스 혜택을 제공받는 레고 배트맨 신작이 긍정적인 평가를 받으며 출시됐다. 포르자 호라이즌 6이 집중 조명을 받는 가운데, 같은 날 얼리 액세스 형태로 공개된 이 타이틀도 게이머와 평론가의 관심을 모으고 있다. Push Square 등 주요 외신 매체들이 '8/10 그레이트' 점수를 부여하며 긍정적인 평가를 내렸다.\n\n레고 배트맨: 레거시 오브 더 다크 나이트는 기존 레고 게임 시리즈의 전통을 따르면서도 신선한 요소를 가미한 것으로 평가된다. 배트맨 프랜차이즈의 풍부한 IP를 활용해 스토리텔링과 비주얼을 강화했다는 점이 긍정적인 평가의 중심이다.\n\nXbox 진영의 게임 라인업 확충 전략이 드러나는 대목이다. Game Pass의 얼리 액세스 프로그램을 통해 구독자들에게 신작 우선 플레이 기회를 제공함으로써 서비스 가치를 강화하는 마이크로소프트의 전략이 계속되고 있다. 이러한 접근은 게임 패스 가입자 확대와 장기 구독 유지에 효과적인 것으로 평가된다.\n\n[한국 유저 가이드]\n- 플랫폼: Xbox Series X|S, Xbox One, PC (Windows 10/11)\n- 이용 방식: Xbox Game Pass 구독자 대상 얼리 액세스 (추가 비용 없음)\n- 정식 출시: 2025년 상반기 예정\n- 한국어 지원: 공식 발표 대기 중 (레고 게임 시리즈는 일반적으로 자막 지원)\n- 한국 정가: 미정 (해외 기준 약 4만~5만원대 예상)	{Xbox,"Xbox Game Pass","LEGO Batman: Legacy of the Dark Knight","얼리 액세스","게임 리뷰"}	PUBLISHED	2026-05-19 11:02:45.486	2026-05-19 11:02:45.486	0
cmo9qzjmt0021t4szo6fyhwuq	Review: Vampire Crawlers: The Turbo Wildcard From Vampire Survivors (Switch) - An Expert Adaptation Of Excess	https://www.nintendolife.com/reviews/switch-eshop/vampire-crawlers-the-turbo-wildcard-from-vampire-survivors	2026-04-20 14:30:00	Nintendo Life	Console	Nintendo	fixed	Vampire Survivors 제작사의 신작 Vampire Crawlers, Switch에서 카드게임으로 장르 재해석	Vampire Survivors 개발사 Poncle의 신작 Vampire Crawlers가 생존 게임의 재미를 덱빌딩 방식으로 성공적으로 재창조했다.	Vampire Survivors라는 전대미문의 장르를 창출한 스튜디오 Poncle이 이번엔 카드게임 형식으로 돌아왔다. Vampire Crawlers는 전작의 직접적인 후속작도, 파생작도 아닌 완전한 장르 재해석이다. 생존 로그라이트의 긴장감과 흥미로움을 덱빌딩 메커니즘으로 훌륭하게 번역해 냈으며, 기존의 친숙한 게임 요소들을 새로운 형태로 재구성해 냈다.\n\n이 게임은 생존게임의 핵심적인 재미를 카드 기반 시스템으로 잘 옮겨냈다는 평가를 받고 있다. 플레이어는 혼돈과 과잉의 감각을 유지하면서도 카드 선택이라는 전략적 깊이를 경험할 수 있다. 구조적으로도 대체로 견고하지만, 자신이 의도한 모든 것을 담으려다 보니 가끔은 과도한 복잡성으로 인한 부담을 안고 가기도 한다.\n\nVampire Survivors가 서바이벌라이크, 불릿 헤븐 등 새로운 게임 카테고리 자체를 만들어낸 만큼, 개발진은 그 다음 단계로 나아가야 한다는 과제를 안았다. Vampire Crawlers는 그 도전에 대한 흥미로운 답변으로, 전혀 다른 장르의 프레임 안에서도 원작의 정신을 살려내는 데 성공했다.	{"Nintendo Switch","Vampire Crawlers",인디게임}	PUBLISHED	2026-04-22 07:45:10.181	2026-05-16 10:37:52.094	4
cmo8pol77000l11mrvt22m7q6	냉병기와 신성의 시대, 스팀 ‘중세 게임 축제’ 시작	https://www.gamemeca.com/view.php?gid=1774279	2026-04-21 02:50:31	게임메카	PC	기타 PC	claude	스팀, 21일부터 '중세 게임 축제' 개시...28일까지 진행	스팀이 중세 시대를 배경으로 한 게임들을 모은 축제를 시작했으며, 크루세이더 킹즈 3 등 주요 타이틀이 대폭 할인된다.	밸브가 스팀에서 '2026 스팀 중세 게임 축제'를 개최했다. 이번 축제는 철기 시대부터 총기 등장 이전까지를 배경으로 하면서, 봉건제 정치 체계와 냉병기 중심의 전투를 다루는 게임들을 집중 조명한다. 28일까지 진행되는 축제 기간 동안 관련 게임들의 정보를 한눈에 확인할 수 있다.\n\n축제에는 '크루세이더 킹즈 3(70% 할인)', '킹덤 컴: 딜리버런스 2(50%)', '다크 소울 3(50%)', '마운트 앤 블레이드 2: 배너로드(50%)' 등 인기 게임 10종 이상이 대거 참여한다. 이들 게임은 전략 시뮬레이션, 액션 RPG, 역사 시뮬레이션 등 다양한 장르를 아우르며, 상당한 수준의 가격 인하를 제공한다.\n\n스팀 측은 중세 게임의 기준을 명확히 정의했다. 게임플레이와 스토리가 중세와 실질적으로 연관되어야 하며, 다중 시대를 다루는 경우라도 중세가 주요 배경으로 설정돼야 한다는 조건을 두었다. 이는 축제의 정체성을 강화하기 위한 의도로 보인다.\n\n축제 종료 후 밸브는 5월 5일부터 12일까지 '스팀 덱 빌딩 게임 축제'를 개최할 예정이다.	{스팀,"중세 게임","게임 할인","크루세이더 킹즈 3"}	PUBLISHED	2026-04-21 14:20:53.203	2026-05-07 13:37:07.35	1
cmo8ppb9w000q11mr8tvhxfxe	[겜ㅊㅊ] 스팀 평가 ‘매긍’ 이상, 로그라이트 신작 5선	https://www.gamemeca.com/view.php?gid=1774245	2026-04-21 01:20:00	게임메카	PC	기타 PC	claude	에드먼드 맥밀런 신작부터 독특한 던전 탐험까지, 스팀 호평 로그라이트 5종	스팀에서 매우 긍정적 평가를 받은 최신 로그라이트 게임들을 소개합니다.	로그라이트 장르가 지속적으로 진화하며 새로운 작품들이 쏟아지고 있습니다. 특히 최근 출시된 신작들 중 스팀 커뮤니티로부터 '매우 긍정적' 이상의 평가를 받은 게임들이 주목할 만합니다. 이러한 게임들은 반복 플레이 속에서 성장하는 로그라이트의 핵심을 유지하면서도 참신한 게임 디자인으로 차별화되고 있습니다.\n\n올해 초반 주목할 신작은 '뮤제닉스'로, '아이작의 번제'로 유명한 에드먼드 맥밀런의 전략 로그라이트입니다. 고양이 육성 시스템이 핵심으로, 교배를 통해 부모의 외형과 능력치, 질병까지 유전되도록 설계되어 전략적인 플레이를 강요합니다. 4만 4천 명 이상의 플레이어가 참여한 평가에서 92% 긍정적 평가를 유지하고 있습니다. 4월 출시된 '솔 세스토'는 태양을 찾기 위해 던전을 탐험하는 로그라이트로, 4x4 타일 맵의 독특한 구조 속에서 진행됩니다. 3천 명 이상의 사용자가 91% 긍정적 평가를 부여했습니다.	{로그라이트,추천,PC게임}	PUBLISHED	2026-04-21 14:21:26.996	2026-05-07 13:37:07.359	1
cmo8pmkoz000711mr06tqfw0n	[오늘의 스팀] 크킹 3, 대형 확장팩과 70% 할인에 관심 급증	https://www.gamemeca.com/view.php?gid=1774302	2026-04-21 07:44:51	게임메카	PC	기타 PC	claude	크루세이더 킹즈 3, 신규 확장팩 챕터 5 출시와 70% 할인으로 스팀 판매 3위 기록	크루세이더 킹즈 3이 4종 확장팩 챕터 5 출시와 대폭 할인으로 스팀 전 세계 판매 순위 3위에 올랐다.	크루세이더 킹즈 3이 신규 확장팩 챕터 5의 출시와 대폭 할인 이벤트를 통해 스팀 전 세계 판매 순위 3위까지 올라섰다. 21일 시작된 중세 게임 축제에 맞춰 본편의 70% 할인이 진행되면서 신규 유저의 관심이 집중되고 있다.\n\n챕터 5는 총 4가지 테마 팩으로 구성됐으며, '권위의 상징'과 '봉역의 노래'가 이미 출시된 상태다. 권위의 상징은 신규 왕관과 머리 장식을 추가하는 미적 콘텐츠이고, 봉역의 노래는 유럽 전통 음악 13곡을 담았다. 종교를 주제로 한 '신의 이름으로'는 2026년 3분기, 무역 중심의 '비단과 은화'는 4분기 출시 예정으로 장기간 콘텐츠 지원 계획을 드러냈다.\n\n챕터 5는 유저로부터 96% 호평을 받으며 긍정적 반응을 얻었다. 이는 약 반 년 전 출시된 '천하' 이후 처음 선보이는 대규모 확장팩으로, 중세 게임 축제 기간 중인 5월 5일까지 본편 할인이 유지될 예정이다.	{"크루세이더 킹즈 3",스팀,확장팩}	PUBLISHED	2026-04-21 14:19:19.236	2026-05-07 16:41:58.502	1
cmo7dy26f000kx67d6vc23ug2	라인게임즈, 협동 공포 신작 &#039;코드 엑시트&#039; 퍼블리싱한다	https://www.gamemeca.com/view.php?gid=1774228	2026-04-20 02:16:52	게임메카	PC	기타 PC	claude	라인게임즈, 협동 공포게임 '코드 엑시트' 퍼블리싱 계약 체결	라인게임즈가 크레젠트의 협동 공포게임 '코드 엑시트' 퍼블리싱을 확정, 2027년 1분기 스팀 앞서 해보기 진행 예정	라인게임즈가 국내 개발사 크레젠트와 신작 협동 공포게임 '코드 엑시트'의 퍼블리싱 계약을 체결했다. 이 게임은 폭주한 인공지능 미네르바가 지배하는 첨단 도시를 배경으로, 플레이어가 조사단체 헤르메스의 일원이 되어 살인 기계를 피하며 진실을 파헤치는 내용이다.\n\n게임의 핵심은 최대 4인 협동 플레이에 있다. 서로 떨어진 위치에서 팀원과 정보를 공유하거나 상호 의존을 통해 미션을 해결하는 방식으로 진행되며, 인게임 보이스 채팅도 지원한다. 적들은 플레이어의 패턴을 학습하는 인공지능 시스템을 적용해 심리적 공포감과 몰입감을 극대화한다.\n\n라인게임즈는 이 게임을 통해 장르 다변화와 PC 타이틀 확대 전략을 추진 중이다. 호러와 협동이라는 장르적 매력을 바탕으로 차별화된 플레이 경험을 제공하려는 의도다.\n\n게임은 조만간 체험판을 공개한 후 플레이어 피드백을 반영한 추가 개발을 거쳐 2027년 1분기 스팀을 통해 앞서 해보기를 진행할 예정이다.	{라인게임즈,협동게임,공포게임,PC,스팀}	PUBLISHED	2026-04-20 16:04:33.543	2026-05-07 16:42:00.72	1
cmo9qyr8q001vt4szg1mbmq4l	Video: Overwatch Official Side-By-Side Comparison (Switch 1 & 2)	https://www.nintendolife.com/news/2026/04/video-overwatch-official-side-by-side-comparison-switch-1-and-2	2026-04-21 00:05:00	Nintendo Life	Console	Nintendo	fixed	오버워치 Switch 2 버전 공개, Switch 1과 나란히 비교한 영상 공개	블리자드가 오버워치의 Switch 2 버전 영상을 공개, 향상된 그래픽과 60fps 지원 확인	블리자드가 지난주 Nintendo Switch 2에 출시한 오버워치의 공식 비교 영상을 공개했다. 기존 Switch 버전과 새로운 Switch 2 버전을 나란히 보여주는 영상을 통해 플레이어들은 두 플랫폼 간의 시각적 차이를 직접 확인할 수 있다.\n\nSwitch 2 버전은 기존 Switch 판본 대비 향상된 그래픽과 개선된 오디오 품질, 그리고 독 모드와 휴대 모드 양쪽 모두에서 최대 60fps의 프레임률을 지원한다. 초기 출시 과정에서 몇 가지 문제가 있었지만, 블리자드는 신속하게 업데이트로 대응했다.\n\n이 비교 영상은 Switch 2의 향상된 하드웨어 성능이 어떻게 게임 경험을 개선하는지 보여주는 사례가 되고 있다. 무료 플레이 팀 기반 슈팅 게임인 오버워치는 Switch 2 출시 라인업 중 주목받는 타이틀로, 이번 업그레이드를 통해 플레이어들의 기대감이 높아지고 있다.	{오버워치,"Nintendo Switch 2","그래픽 비교"}	PUBLISHED	2026-04-22 07:44:33.385	2026-05-19 10:43:22.551	1
cmpcilwpl0008aa8abk39r2fp	싱글플레이 전환, 액션 RPG '아레스' 글로벌 앞서 해보기	https://www.gamemeca.com/view.php?gid=1775384	2026-05-19 08:36:22	게임메카	PC	기타 PC	claude	컴투스홀딩스, 액션 RPG '아레스' 글로벌 앞서 해보기 시작	스타일리시 액션 RPG '아레스'가 글로벌 앞서 해보기를 19일부터 27일까지 진행	컴투스홀딩스가 개발한 액션 RPG '아레스: 더 아이언 밴가드'의 글로벌 앞서 해보기가 19일부터 시작됐다. 이달 27일 오전 9시까지 북미, 유럽, 일본, 동남아시아 등 전 세계 유저를 대상으로 진행되며, 이미 서비스 중인 한국과 대만은 제외된다.\n\n게임은 기존 MMORPG 구조에서 탈피해 싱글플레이 중심의 액션 RPG로 재설계됐다. 근미래 배경의 세계관과 전략적 전투 시스템은 유지하되, 글로벌 유저들의 적응을 위해 초반에 싱글 콘텐츠를 중점 배치했다. 협동 PvE, 시즌제 엔드 콘텐츠, 선택형 PvP 등 다양한 요소를 갖춘다.\n\n에단 평원, 루나 산맥, 오큘러스 등 주요 지역 탐험과 협동 콘텐츠, 대규모 레이드 등을 경험할 수 있다. 회사는 이번 앞서 해보기를 통해 글로벌 팬들의 피드백을 수집하고 초기 팬덤 구축을 목표로 한다.\n\n피드백을 반영해 완성도를 높인 후 하반기 중 정식 출시할 예정이다.	{액션RPG,아레스,글로벌}	PUBLISHED	2026-05-19 10:53:37.881	2026-05-19 10:53:37.881	0
cmpcim1nq0009aa8amh6c3l15	고수 모여라, 플레이엑스포서 '버추어 파이터' 대회 개최	https://www.gamemeca.com/view.php?gid=1775383	2026-05-19 08:32:52	게임메카	기타	기타 기타	claude	세가, 플레이엑스포서 버추어 파이터 전국대회 개최	세가퍼블리싱코리아가 5월 21~24일 일산 킨텍스에서 열리는 플레이엑스포에서 버추어 파이터 시리즈 전국대회를 개최한다.	세가퍼블리싱코리아는 5월 21일부터 24일까지 일산 킨텍스에서 개최되는 플레이엑스포에서 '버추어 파이터3tb'와 '버추어 파이터5 R.E.V.O. 월드 스테이지' 전국대회를 진행한다. 경기는 5월 23일 플레이엑스포 메인 스테이지 우측의 특별 무대에서 열리며, 게임 커뮤니티 모집과 온라인 예선을 거쳐 선발된 32명의 참가자가 토너먼트를 펼친다.\n\n오전 10시 30분부터는 1997년 출시된 '버추어 파이터3tb' 기판을 사용한 대회가 진행되고, 오후 2시부터는 PC 스팀 버전의 '버추어 파이터5' 대회가 이어진다. 각 대회 우승자는 30만 원의 상금과 세가 로고 트로피를 받으며, 국내 격투게임 전문 채널 아지트(AGIT)에서 중계되고 격투 해설가 천창욱이 진행한다.\n\n행사 기간 동안 추억의 게임장과 레트로 장터 부스에서는 '소닉 레이싱 크로스월드' 미니 게임대회와 소닉 시리즈 굿즈 판매 등 다양한 부대행사를 운영한다. 이는 클래식 아케이드 문화를 즐기는 마니아층과 일반 게임 팬들을 위해 마련된 프로그램이다.	{세가,"버추어 파이터",플레이엑스포,게임대회,아케이드}	PUBLISHED	2026-05-19 10:53:44.294	2026-05-19 10:53:44.294	0
cmpcim9vl000aaa8avrofvyhy	왕좌의 게임: 킹스로드, 피카PC방에서 마일리지 증정	https://www.gamemeca.com/view.php?gid=1775381	2026-05-19 08:27:16	게임메카	PC	기타 PC	claude	넷마블 '왕좌의 게임: 킹스로드', 피카PC방 제휴 이벤트 실시	넷마블의 신작 게임이 피카PC방과 협력해 플레이 시간에 따른 마일리지 증정 이벤트를 6월 15일까지 운영한다.	넷마블이 '왕좌의 게임: 킹스로드' 출시 기념으로 미디어웹과 제휴 이벤트를 개최한다. 전국 3,000개 이상의 피카PC방과 개인 PC용 '크래프트박스'를 통해 6월 15일까지 참여 가능하며, 누적 플레이 시간에 따라 피카 마일리지와 게임 아이템을 획득할 수 있다.\n\n이벤트는 출석 체크 방식으로 진행되며, 일일 플레이 시간에 따라 최대 6,000 피카 마일리지를 얻을 수 있다. 누적 플레이 시간이 5시간에 도달하면 수련생의 지도, 휘장 상자, 혼합약, 생활 지원 상자, 동화 등으로 구성된 게임 아이템 쿠폰을 제공받는다.\n\n'왕좌의 게임: 킹스로드'는 HBO의 인기 드라마 시리즈를 원작으로 한 오픈월드 액션 RPG로, 넷마블이 공식 라이선스를 획득해 개발했다. 원작의 세계관과 캐릭터를 충실하게 구현해 게이머들의 몰입감을 높였다.	{넷마블,"왕좌의 게임",PC게임}	PUBLISHED	2026-05-19 10:53:54.945	2026-05-19 10:53:54.945	0
cmpcimf3v000baa8ao5vsplt8	세가·아틀러스, 전 세계 애니메이트서 연간 프로젝트 예고	https://www.gamemeca.com/view.php?gid=1775378	2026-05-19 08:22:00	게임메카	기타	기타 기타	claude	세가·아틀러스, 애니메이트와 손잡고 글로벌 1년 협업 프로젝트 시작	세가와 애니메이트가 소닉·페르소나 등 8개 IP를 활용한 연간 협업 프로젝트 개시, 6월부터 국내 매장에서 전시·굿즈·이벤트 진행	세가와 애니메이트가 글로벌 규모의 1년 협업 프로젝트를 시작한다. 세가와 자회사 아틀러스, 로비오 엔터테인먼트의 주요 IP 8종을 선보이는 이 프로젝트는 국내 애니메이트 매장에서 전시·게임 플레이·굿즈 판매·카페 협업 등 다양한 활동으로 진행된다.\n\n소닉 더 헤지혹, 뿌요뿌요, 하츠네 미쿠, 페르소나 시리즈, 메타포: 리판타지오, 용과 같이, 앵그리 버드 등이 참여한다. 각 IP별로 온리샵과 페어가 단계적으로 개최되며, 캐릭터가 프린트된 그래픽 라테를 판매하고 구매 금액에 따른 특전을 제공한다. 홍대·잠실·부산 애니메이트 지점에서 6월부터 순차적으로 행사가 열릴 예정이다.\n\n세가는 이번 협업을 통해 트랜스미디어 전략을 강화하고 있다. 게임, 영상, 음악 등 다양한 미디어와 제품으로 IP 자산을 확장하면서 팬들에게 새로운 경험을 제공하려는 의도다. 애니메이트와의 파트너십은 오프라인 공간에서 브랜드와 고객의 직접적인 접점을 만드는 중요한 기회다.	{세가,아틀러스,애니메이트,협업,IP,캐릭터굿즈}	PUBLISHED	2026-05-19 10:54:01.723	2026-05-19 10:54:01.723	0
cmpcimk4p000caa8abis0ksky	[겜ㅊㅊ] 고생 끝에 낙이 온다, 소울라이크 신작 5선	https://www.gamemeca.com/view.php?gid=1775379	2026-05-19 08:17:48	게임메카	기타	기타 기타	claude	소울라이크 신작 5선, 스팀에서 검증된 고난도 액션게임	지난해부터 올해까지 출시된 소울라이크 게임 중 스팀 유저 평가 '매우 긍정적' 이상을 받은 작품들을 모았다.	소울라이크는 2009년 '데몬즈 소울'로 시작된 고난도 액션 장르로, 높은 난이도만큼 극복했을 때의 성취감이 뛰어나다. 진입장벽이 높지만 마니아층이 많은 이유다. 이번 추천에서는 작년부터 올해까지 출시된 소울라이크 신작 중 스팀 평가 기준을 충족한 게임들을 소개한다.\n\n'AI 리미트'는 지난해 3월 출시된 액션 RPG로, 애니메이션풍 그래픽과 암울한 세계관이 대비를 이룬다. 스태미너 시스템이 없어 소울라이크 입문자도 접근하기 수월하며, 다양한 무기와 술식 조합으로 높은 자유도를 제공한다. 패링과 회피를 실시간으로 전환할 수 있는 전투 시스템이 특징이다.\n\n'그라임 2'는 4월 출시된 메트로배니아 액션게임으로, 전작의 독특한 아트워크를 계승하면서 더 넓어진 필드와 다채로운 보스 전투를 선보인다. 플레이어는 형태 없는 존재가 되어 적들을 흡수하며 진행하는 독특한 게임플레이를 경험할 수 있다.\n\n이들 게임은 모두 스팀에서 86% 이상의 긍정 평가를 받아 소울라이크 팬들의 검증을 거친 작품들이다.	{소울라이크,액션게임,신작,스팀,게임추천}	PUBLISHED	2026-05-19 10:54:08.233	2026-05-19 10:54:08.233	0
cmpcixxsg0021aa8auw5r5v8w	ASUS Shows Off One-Of-A-Kind ROG Xbox Ally X Based On Cyberpunk 2077	https://www.purexbox.com/news/2026/05/asus-shows-off-one-of-a-kind-rog-xbox-ally-x-based-on-cyberpunk-2077	2026-05-18 12:00:00	Pure Xbox	Console	Xbox	fixed	ASUS ROG Ally X, '사이버펑크 2077' 테마 커스텀 모드 공개... 게이밍 핸드헬드의 미학적 경계 확장	ASUS가 ROG Ally X의 프리미엄 커스텀 모드를 선보였으며, 유명 모더 AK Mod가 사이버펑크 2077의 미래적 디자인을 핸드헬드에 구현해 커뮤니티의 주목을 받았다.	ASUS가 자사의 게이밍 핸드헬드 ROG Ally X의 한정판 커스텀 에디션을 공개했다. 유명 모더 AK Mod가 제작한 이 유니크한 케이스 모드는 CD Projekt Red의 블록버스터 타이틀 '사이버펑크 2077'의 감성을 핸드헬드 디바이스에 투영한 작품으로, 표준 검은색 모델과는 차별되는 고급스러운 외형을 자랑한다. ASUS 공식 채널을 통해 공개된 이 모드는 핸드헬드 게이밍 시장에서 심화되고 있는 '외형 커스터마이제이션' 트렌드를 증명하는 사례다.\n\n공개된 커스텀 모드는 단순한 페인트 칠 수준을 넘어, 사이버펑크 2077의 상징적인 네온 라이팅, 메탈릭 패널 조합, 그리고 정교한 디테일 작업이 특징이다. 이는 표준 ROG Ally X의 프로세서 성능(AMD Ryzen Z1 Extreme 또는 Z1)이나 내부 하드웨어 사양에는 영향을 주지 않으면서도, 게이머들의 개성 표현과 IP 팬덤을 이용한 마케팅 효과를 동시에 노린 전략으로 보인다. 고급 케이스 모드 시장의 성장으로 인해 ASUS, MSI 등 주요 하드웨어 제조사들이 커뮤니티 크리에이터와의 협업을 통해 브랜드 로열티를 강화하는 추세가 확산 중이다.\n\n이러한 움직임은 Nintendo Switch 커뮤니티의 커스텀 독 및 쉘 시장, PlayStation 5의 커버 플레이트 사업 다각화와 맥락을 같이 한다. 콘솔 및 핸드헬드 시장에서 '외형 커스터마이제이션'은 더 이상 선택이 아닌 필수 전략으로, 기본 하드웨어의 성능 경쟁만으로는 불충분한 시장 환경을 반영한다. 특히 ROG Ally X는 Windows 11 기반으로 다양한 게임 라이브러리(Steam, Xbox Game Pass 등)에 접근 가능한 개방형 플랫폼이라는 점에서, 사용자 커스터마이제이션에 대한 수용도가 상대적으로 높은 편이다.\n\n현재 이 커스텀 모드는 일회성 제작품으로, 정규 판매 계획은 공식 발표되지 않았다. 다만 ASUS가 앞으로 제한된 수량의 테마 에디션이나 협력 모더들의 커스터마이제이션 가이드 공개를 통해 수익화 기회를 모색할 가능성이 높다. 국내 유저들이 유사한 커스텀 서비스를 원할 경우, 개인 모더 커뮤니티(Reddit, Discord 등)를 통한 의뢰가 현실적 대안이 될 수 있으며, ROG Ally X 국내 정식 가격은 약 1,099,000원(일반형) ~ 1,399,000원(상위 사양)대에서 형성되어 있다.	{Xbox,"ASUS ROG Ally X","핸드헬드 게이밍",커스터마이제이션,"사이버펑크 2077"}	PUBLISHED	2026-05-19 11:02:59.152	2026-05-19 11:02:59.152	0
cmpcimomt000daa8awxyxgk9j	사진 찍어 게임하자 닌텐도 '픽토니코' 발표, 28일 출시	https://www.gamemeca.com/view.php?gid=1775377	2026-05-19 07:51:23	게임메카	Console	Nintendo	keyword	닌텐도, 사진을 미니게임으로 변환하는 스마트폰 앱 '픽토니코' 5월 28일 출시	닌텐도 신작 스마트폰 앱 픽토니코가 5월 28일 배포된다. 사용자 사진을 인식해 80종 미니게임으로 변환하는 서비스다.	닌텐도가 스마트폰용 신작 앱 '픽토니코'를 5월 28일 배포한다. 이 앱은 사용자가 촬영하거나 보유한 사진을 터치 기반 미니게임으로 자동 변환하는 독특한 개념의 서비스로, 단순하면서도 높은 중독성을 갖춘 '순간 액션 게임'을 지향한다.\n\n픽토니코는 스마트폰에 저장된 사진에서 얼굴을 자동으로 인식하고, 선택한 사진으로 즉시 게임을 시작할 수 있는 방식으로 작동한다. 사용자는 미리 촬영한 사진을 활용하거나 그 자리에서 새로운 사진을 찍어 바로 플레이하는 등 자유로운 방식으로 즐길 수 있어, 가족이나 친구들과의 모임에서 새로운 엔터테인먼트 경험을 제공한다.\n\n앱은 무료로 다운로드 후 3종의 기본 미니게임을 체험할 수 있으며, 유료 팩 구매로 전체 80종의 게임에 접근 가능하다. 점진적으로 난도가 올라가는 스테이지 모드와 실수가 용납되지 않는 스코어 어택 모드, 그리고 운세를 확인하는 포토 운세 기능 등 다양한 플레이 방식을 지원한다.\n\n픽토니코는 iOS 앱스토어와 안드로이드 구글 플레이에서 사전 등록을 진행 중이며, 5월 28일 양 플랫폼에 동시 출시될 예정이다.	{닌텐도,"스마트폰 게임",미니게임}	PUBLISHED	2026-05-19 10:54:14.069	2026-05-19 10:54:14.069	0
cmpcimsoi000eaa8apcadpoqj	어크 블랙 플래그 리싱크드 PS5 패키지, 예약 판매 시작	https://www.gamemeca.com/view.php?gid=1775365	2026-05-19 07:32:25	게임메카	Console	PlayStation	keyword	어쌔신 크리드 블랙 플래그 리싱크드, PS5 예약 판매 개시	유비소프트의 해적 액션 게임 리마스터가 PS5로 19일부터 예약 판매를 시작한다. 7월 9일 출시 예정.	어쌔신 크리드 블랙 플래그의 PS5 리마스터 버전이 19일 오후 3시부터 예약 판매를 개시한다. 7월 9일 정식 출시되는 이 게임은 최신 앤빌 엔진으로 구현되었으며 한국어를 완벽 지원한다.\n\n일반판은 7만 1,000원, 컬렉터스 에디션은 24만 8,000원에 판매된다. 컬렉터스 에디션에는 31cm 규모의 주인공 에드워드 켄웨이 피규어, 가죽 항해일지, 금속 브로치, 스틸북, 지도 천 포스터 등 물리 특전이 포함되며, 양 버전 모두 게임 구매 시 사전 예약 보너스 팩을 받는다.\n\n게임은 개선된 전투 시스템과 정교한 암살 액션을 특징으로 한다. 해상 전투가 강화되어 잭도우 호를 업그레이드하며 적 함대에 맞서고, 은신과 파쿠르 액션의 매끄러운 연계로 다양한 전투 방식을 경험할 수 있다. 원본의 불편함을 해소한 편의성 개선으로 더욱 쾌적한 플레이감을 제공한다.	{"어쌔신 크리드",리마스터,PS5,"예약 판매",해적}	PUBLISHED	2026-05-19 10:54:19.314	2026-05-19 10:54:19.314	0
cmpcimxet000faa8asndq0ysp	3살 된 아우터플레인, 한정 동료 포함 대규모 업데이트	https://www.gamemeca.com/view.php?gid=1775374	2026-05-19 07:13:57	게임메카	기타	기타 기타	claude	아우터플레인, 서비스 3주년 맞아 신규 동료와 실시간 PvP 콘텐츠 추가	전략 RPG 아우터플레인이 19일 대규모 업데이트를 진행하며 한정 동료와 PvP 콘텐츠를 선보인다.	메이저나인은 아우터플레인의 서비스 3주년을 기념해 19일 대규모 업데이트를 실시한다. 한정 동료인 '미드나이트 러시 스카디'가 추가되며, 이 캐릭터는 화속성 공격형 브루저로 보스전 특화 성능을 갖춘다. 3주년 기념 이벤트를 통해 영입과 성장 재화를 획득할 수 있다.\n\n실시간 대전 콘텐츠도 확대된다. 동일 조건에서 전략 전투를 즐기는 '택틱스 리그'에서는 코어 융합 캐릭터 활용이 가능해졌으며, 유저의 육성 캐릭터와 장비로 겨루는 '마스터즈 리그'에는 '밴가드' 기능이 새로 추가되었다.\n\n아우터플레인은 캐릭터와의 상호작용 시스템도 도입했다. '교감하기'와 '대화하기' 기능을 통해 캐릭터에 대한 몰입감과 관계성을 강화했으며, 이는 게임의 스토리텔링 경험을 한층 깊이 있게 만든다.\n\n게임사는 추가로 23일부터 24일까지 서울 일산 킨텍스에서 열리는 '일러스타 페스 11'에 참가한다. 현장에서는 3주년 한정 굿즈와 특별 혜택을 제공하며, 유명 크리에이터와 코스플레이어가 함께한다.	{아우터플레인,3주년,"신규 동료"}	PUBLISHED	2026-05-19 10:54:25.445	2026-05-19 10:54:25.445	0
cmpcin2hs000gaa8an0uv1v3z	마법 존재하는 판타지 ‘아스트라에 오라티오’ 세계관 공개	https://www.gamemeca.com/view.php?gid=1775375	2026-05-19 07:10:22	게임메카	기타	기타 기타	claude	디나미스 원의 신작 '아스트라에 오라티오', 마법 시스템과 핵심 설정 공개	판타지 RPG '아스트라에 오라티오'의 세계관 설정 공개, 마법사 헤카테와 마법 도구 클레이스·아티팩트 소개	디나미스 원이 개발 중인 신전기 서브컬처 RPG '아스트라에 오라티오'가 마법 시스템의 핵심 요소들을 공개했다. 최초의 마법사로 설정된 그리스 신화의 여신 헤카테를 중심으로 마법사들의 자격 조건과 마법 구사 방식이 담긴 세계관 설정이 티저 비주얼을 통해 드러났다.\n\n마법을 사용하려면 '클레이스'라는 열쇠 형태의 도구를 소지해야 한다. 클레이스는 현실과 비현실의 경계를 오가는 역할을 하며, 마법사들이 이를 통해 비현실 영역에 진입해야만 마법을 구사할 수 있다. 마법사들의 무기인 '아티팩트'는 마법적 힘을 담은 골동품이나 발명품 형태로, 비현실 세계에 진입한 마법사만이 진정한 힘을 발휘할 수 있도록 설계됐다.\n\n게임은 마법을 사용하지 못하는 주인공 '주임'과 그를 보호하는 인형 캐릭터의 이야기를 중심으로 전개될 것으로 보인다. 헤카테가 상징하는 달, 그림자, 현실과 비현실의 경계라는 세계관적 배경은 게임의 스토리텔링과 전투 메커니즘을 깊이 있게 구축할 기반으로 작용할 것으로 예상된다.	{"아스트라에 오라티오","신작 RPG",판타지,"마법 시스템"}	PUBLISHED	2026-05-19 10:54:32.032	2026-05-19 10:54:32.032	0
cmpciqsq30018aa8ako9x03ov	Latest PS5 Lawsuit Claims Sony Could 'Double Dip' on Trump's Tariffs	https://www.pushsquare.com/news/2026/05/latest-ps5-lawsuit-claims-sony-could-double-dip-on-trumps-tariffs	2026-05-18 19:00:00	Push Square	Console	PlayStation	fixed	PlayStation 5, 트럼프 관세 정책으로 인한 이중 부과 우려... 소니 법무팀 분주	미국 관세 정책 변화에 따라 PlayStation 5의 수입 원가 구조에 문제가 생길 수 있다는 법적 소송이 제기되면서, 국내 소비자의 PS5 가격 인상 가능성이 대두됐다.	소니의 PlayStation 5를 둘러싼 법적 분쟁이 계속되고 있는 가운데, 최신 소송은 트럼프 행정부의 관세 정책이 PS5에 '이중 부과'될 수 있다는 주장을 제기했다. 해당 소송은 일본 제조사인 소니가 미국 수입 관세와 국내 생산 관세를 동시에 부담할 수 있다는 법적 쟁점을 다루고 있으며, 이는 결국 북미 지역의 소비자 가격에 직결될 가능성이 높다.\n\n구체적인 법적 쟁점은 PS5의 글로벌 공급망 구조와 맞닿아 있다. PS5는 일본에서 설계되고 중국 및 대만 등지에서 부품을 조달한 후 베트남·말레이시아 등에서 최종 조립되어 미국으로 수입되는 복합적인 생산 체계를 거친다. 새로운 관세 정책이 이 모든 단계에 적용될 경우, 같은 제품에 대해 중복으로 관세가 부과되는 '더블 레이어(Double Layer)' 상황이 발생할 수 있다는 것이 법조계의 분석이다.\n\n소니는 현재 여러 건의 소송에 노출되어 있으며, 이들 법적 분쟁은 PlayStation 플랫폼의 가격 책정 전략에 직접적인 영향을 미칠 것으로 예상된다. 특히 북미 시장에서 PS5 Pro(현재 정가 799달러)의 추가 인상이 불가피해질 수 있다. 관세 정책의 불확실성은 향후 차세대 콘솔(PS6) 출시 시점의 가격 결정에도 영향을 미칠 가능성이 있어, 글로벌 콘솔 시장 전체의 메가 트렌드로 작용할 수 있다.\n\n국내 소비자 관점에서는 한국 정식 대리점을 통한 PS5 구매 시 대북미 수출 비용 상승에 따른 간접적인 가격 영향을 받을 수 있다. 현재 국내 PS5 정가는 499,800원(스탠다드 모델 기준)이며, 추가 관세 부담은 향후 신제품 출시 시 국내 권장 소매가(MSRP)에 반영될 가능성이 있다. 한국어 지원은 기존 PlayStation 타이틀과 동일하게 유지될 예정이다.	{"PlayStation 5","하드웨어 가격","관세 정책","법적 분쟁","글로벌 뉴스"}	PUBLISHED	2026-05-19 10:57:25.996	2026-05-19 10:57:25.996	0
cmpcin61e000haa8a0qodzm9u	‘도로’ 열쇠고리 판매, 니케 6월 동대문서 행사 연다	https://www.gamemeca.com/view.php?gid=1775372	2026-05-19 06:38:40	게임메카	Mobile	승리의 여신: 니케	keyword	니케, 6월 동대문서 팝업 스토어 개최...서울 한정 '도로' 열쇠고리 판매	모바일게임 니케가 6월 1~14일 서울 동대문역사문화공원역 근처 GGX에서 공식 팝업 행사를 연다.	모바일게임 '승리의 여신: 니케'가 서울에서 공식 오프라인 행사 '에리어 방어전'을 개최한다. 이 행사는 일본 각 지역을 거쳐 첫 국내 개최되는 것으로, 동대문역사문화공원역 인근 GGX에서 6월 1일부터 14일까지 진행될 예정이다.\n\n행사장에서는 라피: 레드 후드의 신규 일러스트가 담긴 한정 상품들을 판매한다. 서울의 명소를 배경으로 한 아크릴 디오라마, 클리어 파일 세트, 태피스트리부터 서울 한정 '도로' 일러스트 열쇠고리까지 다양한 굿즈가 준비됐다. 현장 구매 고객에게는 5만 원 단위 결제마다 '건걸' 메탈 카드 컬렉션 프로모션 카드를 무작위로 증정한다.\n\n팝업 스토어와 함께 니케 테마 메뉴를 즐길 수 있는 컬래버레이션 카페와 캐릭터와의 기념촬영 공간인 포토존도 운영된다. 모든 한정 상품은 행사장에서만 구매 가능하다.	{"승리의 여신 니케",팝업스토어,모바일게임}	PUBLISHED	2026-05-19 10:54:36.627	2026-05-19 10:54:36.627	0
cmpcina06000iaa8a1gdlak96	데미안 맨손 기술 추가, 붉은사막 발 빠른 1.07 패치 단행	https://www.gamemeca.com/view.php?gid=1775363	2026-05-19 05:27:04	게임메카	PC	붉은사막	keyword	붉은사막 1.07 패치 공개, 데미안 맨손 기술과 신규 탑승물 추가	펄어비스의 붉은사막이 1.07 패치를 통해 데미안 맨손 기술, 늑대·곰 탑승물 등을 추가하고 게임 전반을 개선했다.	붉은사막이 지난 금요일 대규모 패치를 단행했다. 이번 1.07 버전에서는 데미안 캐릭터의 맨손 격투 기술이 신규 추가됐으며, 늑대와 곰을 새로운 탑승물로 이용할 수 있게 됐다.\n\n개선 사항은 콘텐츠뿐 아니라 게임 시스템 전반에 걸쳐 있다. 보스 재대결 옵션 추가, 거점 재봉쇄 기능, 난이도 설정 개선, 조작 커스터마이징 확대 등이 포함됐다. 또한 AMD 드라이버 호환성 문제 해결, 보스 패턴 오류 수정, UI 편의성 향상 등 사용자 체험에 직결된 버그 개선도 이뤄졌다.\n\n글로벌 커뮤니티에서는 제안된 피드백이 다음날 패치에 반영되는 신속한 대응을 높이 평가하고 있다. 레딧과 스팀 사용자들은 '완전히 달라진 게임', '향후 업데이트가 기대된다'는 의견을 남겼으며, 스팀에서 83% 긍정 평가를 유지하고 있다.	{붉은사막,패치,게임업데이트}	PUBLISHED	2026-05-19 10:54:41.766	2026-05-19 10:54:41.766	0
cmpcine96000jaa8ajz0cbs9v	유니아나 플레이엑스포 2026 참가, '유비트' 신기체 공개	https://www.gamemeca.com/view.php?gid=1775349	2026-05-19 04:55:50	게임메카	기타	기타 기타	claude	유니아나, 플레이엑스포 2026서 유비트 신기체 한국 최초 공개	유니아나가 5월 개최되는 플레이엑스포 2026에 참가해 리듬게임 유비트의 신기체를 한국에 처음 선보인다.	유니아나는 5월 21일부터 24일까지 개최되는 플레이엑스포 2026에서 리듬게임 유비트(jubeat)의 신기체를 한국에 최초로 공개한다. 이 신기체는 지난 4월 일본 인컴 테스트에서 호평을 받았으며, 기존 플레이 감각을 유지하면서 전반적으로 개선됐다.\n\n신기체는 120fps 모니터로 부드러운 화면 출력을 지원하고, 상단 터치 모니터로 선곡과 옵션 설정을 편리하게 처리할 수 있다. 플레이 상황에 따라 연출이 달라지는 라이트 큐브 기능과 게임 정보를 표시하는 위젯이 추가돼 새로운 경험을 제공한다.\n\n이번 행사에는 유비트뿐 아니라 팝픈 뮤직의 최신 신기체 '팝픈뮤직 반짝 반짝 팝군 모델'도 전시된다. 댄스러시 스타덤, 사운드 볼텍스 등 다양한 리듬게임과 아케이드 타이틀이 함께 선보이며, 5월 23일에는 비마니 마스터 코리아 드림 매치 대회도 개최될 예정이다.	{유비트,플레이엑스포,아케이드,리듬게임,유니아나}	PUBLISHED	2026-05-19 10:54:47.274	2026-05-19 10:54:47.274	0
cmpcinjf2000kaa8a66cnkb3b	장애인 접근성 높인다, 콘진원 '게임문화포럼' 22일 개최	https://www.gamemeca.com/view.php?gid=1775364	2026-05-19 04:54:05	게임메카	기타	기타 기타	claude	콘진원, 게임 장애인 접근성 논의 포럼 5월 22일 개최	한국콘텐츠진흥원이 장애인을 위한 게임 접근성 개선 방안을 논의하는 포럼을 개최한다.	한국콘텐츠진흥원은 5월 22일 일산 킨텍스에서 2026년 게임문화포럼을 열며, '우리 모두의 로그인'을 주제로 누구나 게임을 즐길 수 있는 환경 조성을 목표로 한다. 장애 유형별 게임 이용 장벽과 개선 방안을 중심으로 게임업계와 학계, 이용자가 함께 실질적인 해결책을 모색할 예정이다.\n\n포럼은 4개의 발제와 종합토론으로 진행된다. 최은경 한신대 교수는 장애인이 게임 이용 중 겪는 구체적인 장벽을 분석하고, 반지하게임즈와 캥스터즈의 대표들은 자막 개선과 보조기기 활용 등 실제 게임들의 접근성 강화 사례를 소개한다. 마지막으로 콘진원은 2022년부터 추진한 연구 결과를 바탕으로 시각·청각·운동·인지 분야별 게임 접근성 가이드라인을 제시하고 산업 현장에 적용 가능한 구체적 예시를 공개한다.\n\n이번 포럼은 게임 접근성이 단순한 복지 이슈를 넘어 산업 전반의 표준으로 자리 잡기 위한 제도적·산업적 협력 방안을 제시하는 자리가 된다. 장애인 게임 이용자 규모가 지속적으로 증가하는 가운데, 개발사들이 설계 단계부터 접근성을 고려하는 관행을 정착시키는 것이 주요 목표다.	{"게임 접근성",장애인,게임문화포럼}	PUBLISHED	2026-05-19 10:54:53.967	2026-05-19 10:54:53.967	0
cmpciy67j0022aa8ak1yr1kik	Forza Horizon 6 'New Zealand' Trick Is Going Viral For The Full Xbox Launch	https://www.purexbox.com/news/2026/05/forza-horizon-6-new-zealand-trick-is-going-viral-for-the-full-xbox-launch	2026-05-18 10:15:00	Pure Xbox	Console	Xbox	fixed	Xbox Game Pass, '포르자 호라이즌 6' 뉴질랜드 시간대 우회 접근법 확산... 얼리 액세스 가능	Xbox Game Pass Ultimate 구독자들이 계정 지역 변경을 통해 '포르자 호라이즌 6'을 공식 출시 전 플레이할 수 있다는 정보가 커뮤니티에서 화제를 모으고 있습니다. 지역 시간대 차이를 활용한 이른바 '뉴질랜드 트릭'의 위험성과 함께 정식 출시 일정을 짚어봅니다.	Xbox 커뮤니티에서 화제가 된 '뉴질랜드 트릭'이 '포르자 호라이즌 6' 얼리 액세스 수단으로 재조명되고 있습니다. 이 방식은 Xbox 계정의 지역 설정을 뉴질랜드로 변경해 시간대 차이를 이용해 글로벌 동시 출시 게임을 미리 플레이하는 기법인데, Xbox Game Pass Ultimate 구독자들 사이에서 수년에 걸쳐 널리 알려져 왔습니다. 포르자 호라이즌 6의 경우 뉴질랜드 지역의 출시 시간인 오늘(보도 시점 기준)부터 이 방식으로 접근이 가능한 상태입니다.\n\n기술적으로는 계정 지역 변경 과정이 복잡하지 않아 진입 장벽이 낮다는 점이 확산의 주요 요인입니다. Xbox Game Pass 구독자들이 포르자 호라이즌 6을 정식 글로벌 출시일(예상 10월 중순)보다 수일 앞서 플레이할 수 있다는 것이 핵심입니다. 다만 지역 변경을 통한 얼리 액세스는 Xbox의 약관상 그레이존에 위치한 행위로, 소니의 PlayStation Network나 마이크로소프트의 공식 가이드에서 명시적으로 권장하지 않는 방식입니다.\n\n이 트릭의 확산은 Xbox Game Pass의 글로벌 경쟁력을 보여주는 지표이면서 동시에 정식 출시 일정 관리의 한계를 드러냅니다. 마이크로소프트는 게임 퍼블리셔들과의 계약 관계상 지정된 출시 시간을 준수해야 하지만, 시간대 기반의 지역 설정 차이를 완벽하게 통제하기는 어렵다는 점이 지속적으로 문제되어 왔습니다. 향후 클라우드 게이밍 기술 고도화와 함께 이러한 우회 접근법을 기술적으로 차단하려는 움직임이 가속화될 것으로 예상됩니다.\n\n**국내 구매 및 이용 안내**: 포르자 호라이즌 6은 Xbox Game Pass Ultimate(월 16,900원) 또는 직구를 통한 정식 구매로 이용 가능합니다. 한국어 자막 지원이 예정되어 있으며, 정식 글로벌 동시 출시일은 별도 공지 시까지 Xbox 공식 채널을 확인하시기 바랍니다. 지역 변경을 통한 얼리 액세스는 이용약관 위반 리스크가 있으므로 권장하지 않습니다.	{Xbox,"포르자 호라이즌 6","Xbox Game Pass","얼리 액세스"}	PUBLISHED	2026-05-19 11:03:10.064	2026-05-19 11:03:10.064	0
cmpcino1r000laa8atzt0ydab	플레이엑스포 인디오락실, 게임 35종 참여한다	https://www.gamemeca.com/view.php?gid=1775359	2026-05-19 03:46:48	게임메카	기타	기타 기타	claude	국내 인디게임 35종, 2026 플레이엑스포 인디오락실 전시	한국인공지능게임협회는 5월 21~24일 킨텍스에서 열리는 플레이엑스포에 35개 인디게임 팀을 참여시킨다.	한국인공지능게임협회가 경기도 주최 글로벌 게임 전시회 '2026 플레이엑스포'와 연계한 인디게임 브랜드관 '인디오락실'을 개최한다. 오는 5월 21부터 24일까지 일산 킨텍스에서 열리는 이 행사에는 35개 인디게임 개발사와 팀이 참여하며, 로그라이크 액션부터 RPG, 시뮬레이션, 어드벤처, 퍼즐까지 다양한 장르의 게임을 선보인다.\n\n전시는 장르별 존으로 구성되어 방문객의 관람 편의를 높였다. 로그라이크·액션 존에서는 빠른 전투와 반복 플레이 기반 게임성을 중심으로, RPG·시뮬레이션 존에서는 세계관과 성장 요소를 강조한 작품들이 배치된다. 어드벤처·퍼즐 존에는 스토리텔링과 탐험 요소 중심의 타이틀이 전시된다. 참가팀들은 PC, 콘솔, 모바일 등 다양한 플랫폼 대응 작품을 준비 중이다.\n\n행사 기간 개발자들이 직접 게임을 시연하며 방문객과 소통하고 의견을 수렴할 예정이다. 협회는 게임성과 완성도, 현장 체험 요소를 종합적으로 평가하여 주목할 만한 작품들을 선별했으며, 국내 인디게임의 다양성과 가능성을 체험할 수 있는 공간으로 구성했다고 밝혔다.	{인디게임,플레이엑스포,게임전시회}	PUBLISHED	2026-05-19 10:54:59.967	2026-05-19 10:54:59.967	0
cmpcinsmq000maa8acrz7ci3b	유니폼 포함, 쿵야 '두산 베어스' 컬래버레이션 제품 출시	https://www.gamemeca.com/view.php?gid=1775360	2026-05-19 03:36:27	게임메카	기타	기타 기타	claude	넷마블 '쿵야 레스토랑즈', 두산 베어스와 손잡고 유니폼·굿즈 9종 출시	쿵야 캐릭터 유니폼, 볼캡, 응원타올 등 공식 굿즈 9종을 선보여	넷마블 자회사 엠엔비가 쿵야 레스토랑즈 브랜드로 두산 베어스 공식 콜래보레이션 제품을 공개했다. 양파쿵야와 주먹밥쿵야의 레플리카 유니폼 2종을 비롯해 볼캡, 응원타올, 기념구, 봉제인형 머리띠, 인형 키링 등 총 9종의 굿즈를 준비했다.\n\n특히 유니폼은 선수 이름과 쿵야 캐릭터를 결합한 커스텀 마킹 서비스를 제공한다. 제품은 22일부터 NOL MD샵에서 구매할 수 있으며, 6월 2일부터 3일까지 잠실 야구장에서도 판매된다.\n\n쿵야 레스토랑즈는 2022년부터 시작된 쿵야의 스핀오프 브랜드로, 인스타그램을 통해 현대 사회를 배경으로 한 캐릭터들의 이야기를 전개하고 있으며 현재 팔로워 16.7만명을 보유하고 있다.	{쿵야,두산베어스,콜래보레이션,굿즈,유니폼}	PUBLISHED	2026-05-19 10:55:05.906	2026-05-19 10:55:05.906	0
cmpcinx8o000naa8ae1wt1aco	게임법 전부개정안 포럼, 진흥원과 게임위 역할 논의	https://www.gamemeca.com/view.php?gid=1775358	2026-05-19 03:22:23	게임메카	기타	기타 기타	claude	게임산업법 전부개정안 논의, 진흥원과 관리위 거버넌스 체계 검토	한국게임정책자율기구가 게임산업법 개정안의 조직 체계와 역할 분담을 논의하는 전문가포럼 개최	한국게임정책자율기구는 5월 13일 게임산업법 전부개정안에 따른 게임진흥원과 게임관리위원회의 향후 운영 방향을 논의하는 전문가포럼을 개최했다. 작년 9월 발의된 개정안을 중심으로 게임산업 거버넌스의 설계 및 운영 방식에 대한 실질적인 검토가 이뤄졌다.\n\n박종현 한양대 교수는 행정 조직 설계 시 효율성이 필요한 영역은 독임제, 독립성과 전문성이 중요한 영역은 합의제 구조를 적용하는 것이 일반적이라고 설명했다. 토론에서는 게임 등급분류와 사후관리 업무의 특성을 고려한 합의제 활용 가능성과 민간이양 확대 후 관리위원회의 역할 재정의에 대한 의견이 수렴됐다.\n\n황성기 의장은 "거버넌스 개편은 전부개정안의 핵심 쟁점"이라며 "제도의 현실성과 산업 환경 변화, 이용자 수용성을 고려한 논의를 지속하겠다"고 밝혔다. 한국게임정책자율기구는 6월 경품 규제 조항을 중심으로 제6차 포럼을 개최할 예정이며, 하반기에는 등급분류 제도와 거버넌스를 주제로 정책토론회를 진행할 계획이다.	{게임법,거버넌스,게임정책}	PUBLISHED	2026-05-19 10:55:11.88	2026-05-19 10:55:11.88	0
cmpcio1mz000oaa8aj5eusw6h	스마게 퓨처랩, 인디게임 축제 '비버롹스 2026' 참가 모집	https://www.gamemeca.com/view.php?gid=1775352	2026-05-19 03:14:57	게임메카	기타	기타 기타	claude	스마일게이트 퓨처랩, 인디게임 축제 '비버롭스 2026' 전시팀 모집 시작	스마일게이트 퓨처랩이 12월 개최되는 국내 최대 규모 인디게임 축제 '비버롭스 2026'의 참가팀을 모집한다.	스마일게이트 퓨처랩이 인디게임 축제 '비버롭스 2026'의 전시팀 모집을 시작했다. 올해 행사는 12월 18일부터 20일까지 서울 강남구 세텍에서 개최되며, 이전보다 확대된 규모의 전시장에서 국내 창작자와 게이머가 만나는 자리가 될 예정이다.\n\n지난 4년간 4만 4,000여 명의 방문객을 모은 비버롭스는 수도권 최대 규모의 인디게임 축제로 자리잡았다. 모집은 7월 27일까지 공식 홈페이지에서 진행되며, 게임 출시 여부나 투자 계약 유무와 관계없이 개발 중인 팀과 개인 누구나 참가할 수 있다.\n\n퓨처랩은 참가팀에 전시 부스와 기기를 무료로 지원하고, 행사 중 수집된 유저 피드백 리포트를 제공해 개발에 직접 활용할 수 있도록 돕는다. 아울러 창작자 간 투표를 통한 '비버피처드' 수상 기회와 네트워킹 프로그램도 마련해 인디 개발자들의 상호 성장을 지원한다.	{인디게임,게임축제,비버롭스,스마일게이트}	PUBLISHED	2026-05-19 10:55:17.579	2026-05-19 10:55:17.579	0
cmpciyel10023aa8a22ckbgp2	Five Games Are Leaving Xbox Game Pass In Late May 2026	https://www.purexbox.com/news/2026/05/five-games-are-leaving-xbox-game-pass-in-late-may-2026	2026-05-18 09:15:00	Pure Xbox	Console	Xbox	fixed	Xbox Game Pass, 5월 말 대작 5종 퇴출... '메타포: 리판타지오' 등 아틀라스 명작들 서비스 이탈	마이크로소프트가 Xbox Game Pass에서 5월 말 퇴출될 게임 5종을 공식 공개했으며, 아틀라스의 화제작 '메타포: 리판타지오'와 '페르소나 4 골든' 등 명작 JRPG들이 포함돼 구독자들의 관심이 집중되고 있다.	마이크로소프트가 Xbox Game Pass의 5월 말 이탈 게임 라인업을 공식 발표했다. Xbox 모바일 앱의 '곧 출발' 섹션에 플래그되어 있는 이번 퇴출 목록에는 특히 주목할 만한 타이틀들이 다수 포함돼 있어, 구독 서비스 이용자들의 긴급 플레이가 예상되고 있다.\n\n이번 퇴출 라인업에서 가장 눈에 띄는 게임은 단연 아틀라스의 '메타포: 리판타지오'다. 올해 대형 JRPG로 평단과 유저 모두에게 호평을 받았던 이 작품은 세가 마스터피스 '페르소나 4 골든'과 함께 Game Pass를 떠날 예정이다. 두 게임 모두 턴 기반 전술 시뮬레이션 및 심화된 캐릭터 육성 시스템으로 정평이 나 있으며, Game Pass 구독층 중 JRPG 팬들 사이에서는 상당한 인지도를 확보하고 있었다.\n\nGame Pass의 주기적인 게임 교체는 라이선싱 비용 관리 및 신규 타이틀 확보를 위한 마이크로소프트의 표준 운영 전략으로, 보유 중인 게임을 사전에 안내하고 구독자에게 플레이 기회를 제공하는 방식으로 진행되고 있다. 특히 JRPG 장르는 라이선싱 갱신 비용이 높은 편으로, 주요 대작들의 교체 주기는 보통 12~24개월 범위 내에서 결정된다. 이는 Game Pass의 장기 구독 가치와 직결되는 중요한 이슈로, 플레이 계획 수립 시 사용자들이 특히 주의깊게 살펴야 하는 부분이다.\n\n**국내 유저 가이드**: '메타포: 리판타지오'와 '페르소나 4 골든' 모두 Game Pass 자격으로 플레이 가능하며, 한국어 자막이 지원된다. 두 게임 모두 본 서비스에서 이탈하기 전에 플레이 완료하거나, 이후 구매를 원할 경우 PlayStation Store 또는 Steam에서 각각 5만 9천 원대로 정식 판매 중이다. Xbox Game Pass Ultimate 구독료는 월 16,500원이며, 퇴출 타이틀 목록은 Xbox 공식 앱에서 실시간으로 확인할 수 있다.	{"Xbox Game Pass","메타포: 리판타지오","페르소나 4 골든",JRPG,"서비스 라이선싱","구독 서비스"}	PUBLISHED	2026-05-19 11:03:20.917	2026-05-19 11:03:20.917	0
cmpcio6kq000paa8avv6pvl63	BIC 선정작 6종, 日 인디게임 행사 '비트서밋 펀치' 출전	https://www.gamemeca.com/view.php?gid=1775356	2026-05-19 03:14:35	게임메카	기타	기타 기타	claude	부산 선정 인디게임 6종, 일본 최대 인디게임쇼 '비트서밋 펀치'에 전시	빅잼 4기 선정작 6종이 5월 일본 교토에서 열리는 비트서밋 펀치 2026에 참가해 글로벌 시장 진출을 시도한다.	부산인디커넥트페스티벌(BIC) 주최로 선정된 인디게임 6종이 5월 22~24일 일본 교토에서 개최되는 '비트서밋 펀치 2026'에 출전한다. 일본 인디게임협회(JIGA)가 주최하는 일본 최대 규모의 국제 인디게임쇼로, 선정작들은 전용 부스를 통해 일본 게이머들과 직접 만나 피드백을 받을 예정이다.\n\n전시에 참가하는 작품은 블랙가디언의 'Vending Machine Hero', 트윈채리엇의 'XX 물류센터', 화이트카이트의 '할로원더밴드', ZPINK의 '닥터 디가우스', 무기고의 '마왕의 탑', 1HPSTUDIO의 '이나리' 등 6종이다. 이들은 게임문화재단, 펄어비스, 부산정보산업진흥원이 함께 추진하는 '빅잼(BIGEM)' 프로그램을 통해 해외 전시 참가, 부스 운영, 마케팅 지원을 받는다.\n\n빅잼은 2022년부터 BIC 전시작 중 우수 인디게임을 선정해 국제 게임쇼 진출을 지원해온 프로젝트다. 올해부터는 지원 대상을 한국콘텐츠진흥원 지원 게임사로 확대해 더 많은 개발사에 해외 진출 기회를 제공하고 있다.	{인디게임,부산,비트서밋,해외진출,게임쇼}	PUBLISHED	2026-05-19 10:55:23.979	2026-05-19 10:55:23.979	0
cmpcioayn000qaa8a4vokdena	마스터리 귀걸이 추가, 뮤 온라인 '망각의 라클리온' 열렸다	https://www.gamemeca.com/view.php?gid=1775354	2026-05-19 03:08:09	게임메카	기타	기타 기타	claude	뮤 온라인, 신규 사냥터 '망각의 라클리온' 오픈 및 마스터리 귀걸이 추가	웹젠이 뮤 온라인에 신규 사냥터와 마스터리 액세서리를 추가하고 최대 레벨을 상향 조정했다.	웹젠은 PC MMORPG 뮤 온라인에 신규 사냥터 '망각의 라클리온'을 오픈했다. 오로라로 덮인 이 지역에는 세 종류의 강력한 신규 몬스터가 등장하며, 사냥을 통해 획득한 속성 징표를 조합하면 상급 펜타그램 같은 재료를 얻을 수 있다.\n\n함께 추가된 신규 마스터리 액세서리 '자애의 귀걸이'는 두 종류로 구성되어 있으며, 각각 장착 시 다양한 옵션이 발동한다. 두 귀걸이를 세트로 갖추면 더욱 강화된 효과를 체험할 수 있다. 캐릭터 최대 레벨도 기존 1,750에서 1,800으로 상향 조정되었으며, 최고 레벨 달성자에게는 '건크래셔 뮨'을 지급한다.\n\n업데이트를 기념해 경험치 획득량 증대, 몬스터 체력 감소, 액세서리 강화 확률 상승 등의 이벤트가 진행된다. 무료 접속 서비스 '뮤 블루'의 신규 서버 '노리아'도 동시 오픈되며, 신규 서버 플레이어는 주간 무료 비약과 성장 아이템을 제공받는다.	{"뮤 온라인",업데이트,"신규 콘텐츠"}	PUBLISHED	2026-05-19 10:55:29.664	2026-05-19 10:55:29.664	0
cmpciofp9000raa8aenq9940u	그라비티, 자사 6종 타이틀로 비트서밋 펀치 2026 참가한다	https://www.gamemeca.com/view.php?gid=1775351	2026-05-19 03:03:00	게임메카	기타	기타 기타	claude	그라비티, 비트서밋 펀치 2026서 신작 2종 포함 6개 게임 전시	그라비티 게임 어라이즈가 일본 최대 인디게임 축제에 신작 2종을 포함한 6개 타이틀을 출품한다.	그라비티의 일본 지사 그라비티 게임 어라이즈가 22일부터 24일까지 교토에서 개최되는 비트서밋 펀치 2026에 참여한다. 이번 전시회에서는 '눈치게임 월드 한국 Ver.'와 '디 애슌 오즈' 2개의 신작을 포함해 총 6개 게임을 선보일 예정이다.\n\n신작 중 '디 애슌 오즈'는 '오즈의 마법사'를 각색한 다크 판타지 로그라이크 액션 게임으로, 빠른 전투를 핵심으로 삼았다. '눈치게임 월드 한국 Ver.'는 한국 문화와 일상의 공감대를 담아낸 눈치 측정 게임이다. 이외에도 1994년 출시작을 현대적으로 재해석한 '달려라 헤베레케 EX', 던전 탐색과 빵집 경영을 결합한 '아루타' 등 다양한 장르의 게임을 경험할 수 있다.\n\n비트서밋 펀치는 일본 최대 규모 인디게임 축제로, 올해 '하이 임팩트'를 주제로 인디 개발자들의 창의성이 세상을 변화시키는 과정을 기념한다. 지난해 5만 8,000명 이상의 방문객을 기록했으며, 매년 그 규모와 영향력을 확대하고 있다.	{그라비티,비트서밋펀치2026,인디게임}	PUBLISHED	2026-05-19 10:55:35.805	2026-05-19 10:55:35.805	0
cmpciolst000waa8abal2c549	1개월권 11% 상승, PS 플러스 국내 가격 또 오른다	https://www.gamemeca.com/view.php?gid=1775355	2026-05-19 02:44:44	게임메카	Console	PlayStation	claude	소니, PS 플러스 에센셜 가격 또 인상...1개월권 11% 올라	PS 플러스 에센셜 1개월권이 1만800원에서 1만2000원으로 인상된다.	소니가 플레이스테이션 플러스 에센셜의 월간 구독료를 인상한다. 20일부터 신규 고객을 대상으로 1개월권이 기존 1만800원에서 1만2000원으로 올랐으며, 3개월권도 2만8400원에서 3만1000원으로 높아진다. 기존 구독자는 갱신 시까지 현재 가격이 유지된다.\n\n에센셜 외 스페셜과 디럭스 티어는 가격이 동결됐다. 소니는 시장 상황 변화를 가격 인상의 배경으로 설명했다.\n\n이는 소니의 지속적인 가격 정책 변화의 연장선이다. 지난해 4월 PS 플러스 전 티어를 최소 43% 이상 인상했고, 5월에는 PS5와 PS5 Pro 콘솔 가격도 올렸다. 누적으로 에센셜 월간 구독료는 2년 전 대비 약 60% 상승했다.	{PS플러스,가격인상,소니}	PUBLISHED	2026-05-19 10:55:43.709	2026-05-19 10:55:43.709	0
cmpciopgz000xaa8avdghkq23	팰월드 소송 제동 걸리나, 닌텐도 일본서도 특허 거절	https://www.gamemeca.com/view.php?gid=1775350	2026-05-19 02:19:52	게임메카	Console	Nintendo	keyword	닌텐도 팰월드 소송 관련 핵심 특허, 일본에서 거절	닌텐도가 팰월드 소송에 제시하려던 게임 시스템 특허가 일본 특허청에서 거절당했다.	닌텐도와 포켓몬이 공동 출원한 게임 시스템 특허가 일본 특허청으로부터 거절 통지를 받았다. 이 특허는 터치 화면을 통해 필드에서 캐릭터를 포획하고 전투에 활용하는 시스템에 관한 것으로, 팰월드와 직접적으로 겹치는 기술이다.\n\n일본 특허청 심사관은 해당 기술이 새로운 발명이 아니라는 이유로 거절했다. 2013년 팬이 만든 3D 게임인 '포켓몬 제너레이션즈'에 이미 유사한 포획 및 전투 시스템이 존재했고, 'ARK'나 '배틀그라운드' 같은 기존 게임들도 비슷한 기술을 사용하고 있다는 점을 지적했다. 특허청은 이를 업계에 널리 알려진 기술들의 단순한 조합으로 판단했다.\n\n이 결정은 닌텐도가 팰월드 개발사 포켓페어를 상대로 진행 중인 특허 침해 소송에 실질적인 타격을 줄 것으로 보인다. 거절된 특허가 소송의 주요 법적 근거가 될 수 있었기 때문이다.	{닌텐도,팰월드,특허분쟁}	PUBLISHED	2026-05-19 10:55:48.467	2026-05-19 10:55:48.467	0
cmpciouei000yaa8au2diw07a	‘펌프 잇 업 피닉스 2’ 6월 출시, 플레이엑스포서 첫 선	https://www.gamemeca.com/view.php?gid=1775348	2026-05-19 01:38:17	게임메카	기타	기타 기타	claude	안다미로, '펌프 잇 업 피닉스 2' 6월 출시 예정	아케이드 리듬 게임 신작이 플레이엑스포에서 공개되며 K-POP 곡과 새로운 랭크 시스템을 추가한다.	안다미로가 아케이드 리듬 게임 '펌프 잇 업' 시리즈의 신작 '펌프 잇 업 피닉스 2'를 6월에 출시한다. 게임은 플레이엑스포 2026에서 최초로 공개될 예정이며, 5월 24일 진행되는 아시아-퍼시픽 토너먼트의 메인 스테이지에서 7개국 대표 선수들의 경기가 펼쳐진다.\n\n신작은 기존 '피닉스'의 게임성을 기반으로 최신 인기 K-POP 곡들을 신규 수록했다. 플레이어의 실력과 성과를 표시하는 펌빌리티 랭크 시스템과 개선된 라이벌 시스템이 도입되어 경쟁 요소와 지속적인 플레이 동기를 강화했다. 라이벌 시스템은 솔로 플레이 중 지정된 라이벌의 정보를 확인할 수 있어 플레이의 몰입감을 높인다.\n\n피닉스 2는 스팀에서 서비스 중인 '펌프 잇 업 라이즈' 보유자를 위한 연동 기능을 제공한다. 라이즈 사용자는 피닉스 2 아케이드 버전에서 라이즈 전용 채보와 콘텐츠를 플레이할 수 있으며, 두 버전의 통합을 통해 플랫폼 간 경험을 확장한다. 전용 컨트롤러도 함께 선보일 예정이다.	{펌프잇업,아케이드,리듬게임}	PUBLISHED	2026-05-19 10:55:54.859	2026-05-19 10:55:54.859	0
cmpciozgh000zaa8a57ugfyf3	4주년 기념 '프리프 유니버스' 한정 탈 것·코스튬 선보여	https://www.gamemeca.com/view.php?gid=1775347	2026-05-19 01:33:40	게임메카	Mobile	원신	claude	프리프 유니버스, 4주년 기념 한정 코스튬·탈 것 공개	프리프 유니버스가 4주년을 맞아 19일부터 다음 달 25일까지 특별 이벤트를 진행한다.	갈라랩 개발, 위메이드커넥트 서비스의 HTML5 MMORPG 프리프 유니버스가 출시 4주년 기념 이벤트를 19일 시작했다. 신규·복귀 이용자를 포함한 모든 플레이어가 참여할 수 있으며, 다음 달 25일까지 진행되는 이번 행사에서는 4주년 한정 코스튬 '여신의 축복'과 한정판 탈 것 '부릉부릉' 등을 획득할 수 있다.\n\n배너 조각을 모아 특정 단어를 완성하는 '생일 배너 되찾기'와 매일 4회 등장하는 특별 보스에 도전하는 '4주년 보스 인스턴스' 등 다양한 이벤트가 준비됐다. 모든 보스 인스턴스는 캐릭터 성장 수준에 관계없이 동등한 피해를 입힐 수 있도록 설계되어 진입 장벽을 낮췄다. 이 외에도 매일 40분 이상 접속 시 보상을 얻는 출석체크와 서버 단위 필드 몬스터 처치 이벤트도 함께 진행된다.\n\n위메이드커넥트는 글로벌 이용자들의 4년간의 지지에 감사하며 지속적인 콘텐츠 업데이트를 약속했다. 이어 10월 진행될 'FWC(Flyff Universe World Championship) 2026' 대회는 전년도 대비 약 2배에 달하는 10만명 규모의 사전예약을 기록하며 관심을 모으고 있다.	{"프리프 유니버스","4주년 이벤트","한정 코스튬",MMORPG}	PUBLISHED	2026-05-19 10:56:01.41	2026-05-19 10:56:01.41	0
cmpcip3bv0010aa8a1s9noqek	향상된 프레임 '레드 데드 리뎀션' PS5 패키지, 29일 출시	https://www.gamemeca.com/view.php?gid=1775344	2026-05-18 10:38:34	게임메카	Console	PlayStation	keyword	레드 데드 리뎀션 PS5 한국어판 실물 패키지 5월 29일 정식 출시	H2 인터렉티브가 레드 데드 리뎀션 PS5 한국어 지원 실물 패키지를 5월 29일 출시한다. 확장팩 언데드 나이트메어가 함께 수록된다.	H2 인터렉티브가 '레드 데드 리뎀션' PS5 한국어 지원 실물 패키지를 5월 29일 정식 출시한다. 이번 패키지는 본편과 확장팩 '언데드 나이트메어'를 함께 제공하며, 5월 18일부터 예약 판매를 진행한다.\n\nPS5 버전은 초당 60프레임과 함께 향상된 이미지 품질, HDR 지원, 최대 4K 해상도를 제공한다. 서부 개척 시대를 배경으로 한 이 게임은 무법자 존 마스턴이 가족을 구하기 위해 갱단의 잔당을 추적하는 이야기를 그리며, 2018년 출시된 '레드 데드 리뎀션 2' 이후의 사건을 다룬다.\n\n패키지에 함께 수록되는 '언데드 나이트메어'는 초자연적인 공포로 뒤덮인 서부를 배경으로 좀비 무리와의 전투를 펼치는 스토리 확장팩이다. 2010년 첫 출시 이후 170개 이상의 올해의 게임상을 수상한 이 타이틀은 명예와 충성이라는 주제를 통해 카우보이 시대의 황혼을 표현한다.	{PlayStation,PS5,"레드 데드 리뎀션",한국어판,실물패키지}	PUBLISHED	2026-05-19 10:56:06.427	2026-05-19 10:56:06.427	0
cmpcip8eh0011aa8a6nwpg8y3	스타2 GSL 시즌1 김준호 제패, 프로토스 최다 우승 달성	https://www.gamemeca.com/view.php?gid=1775343	2026-05-18 10:32:34	게임메카	Esports	기타 Esports	claude	김준호, GSL 시즌1 우승으로 프로토스 최다 우승 기록 수립	스타크래프트2 GSL 시즌1 결승에서 김준호가 신희범을 4:2로 꺾고 우승, 프로토스 종족 단독 최다 우승자 달성	스타크래프트2의 최고 리그 GSL 시즌1 결승이 17일 서울 대치동에서 개최돼 김준호 선수가 신희범 선수를 4:2로 격파했다. 이 우승으로 김준호는 프로토스 종족 사상 단독 최다 우승자라는 역사적 기록을 세우며 한국 전자스포츠의 또 다른 이정표를 남겼다.\n\n신희범은 초반 저글링과 히드라 중심의 공격 운영으로 2:0까지 앞서갔으나, 김준호의 예언자 견제와 집정관, 광전사, 사도를 조합한 타이밍 공격이 점차 위력을 드러냈다. 후반으로 갈수록 김준호의 프로토스 운영이 신희범의 저그 공격을 효과적으로 저지하기 시작했으며, 5세트에서 공허 포격기의 활약이 돋보이며 역전의 고지에 올랐다.\n\n17년간 이어져 온 GSL은 팬들의 크라우드 펀딩을 통해 성립되는 리그로, 선수와 팬이 함께 만들어가는 장수 토너먼트로 자리 잡았다. 인텔이 메인 스폰서로 참여한 이번 시즌은 스타크래프트 프로씬의 지속 가능성을 입증하는 중요한 대회다.	{GSL,스타크래프트2,김준호,e스포츠}	PUBLISHED	2026-05-19 10:56:13.001	2026-05-19 10:56:13.001	0
cmpciym7o0024aa8avtpapp97	Xbox Takes #1 Spot In Metacritic's Top 10 Video Games Of 2026 So Far	https://www.purexbox.com/news/2026/05/xbox-takes-1-spot-in-metacritics-top-10-video-games-of-2026-so-far	2026-05-17 15:00:00	Pure Xbox	Console	Xbox	fixed	Xbox, 메타크리틱 2026년 최고 평점 게임 1위 차지... '포르자 호라이즌 6' 신작 물결 주도	포르자 호라이즌 6가 메타크리틱 2026년 멀티플랫폼 게임 순위에서 1위를 획득하며, Xbox의 신작 라인업 강화 전략이 글로벌 호평을 받고 있습니다.	Xbox 독점작 '포르자 호라이즌 6'이 메타크리틱의 2026년 최고 평점 게임으로 선정됐습니다. 이는 레이싱 장르를 대표하는 프랜차이즈가 신작으로서 얼마나 높은 완성도를 보여줬는지를 방증하며, Xbox Series X|S 플랫폼의 그래픽 성능과 로드 최적화가 전문 평론가들의 신뢰를 획득했음을 의미합니다.\n\n메타크리틱의 평가 방식상 포르자 호라이즌 6의 최종 점수는 리뷰 수가 가장 많은 플랫폼 버전을 기준으로 산정됩니다. 멀티플랫폼 게임 순위는 새로운 신작만 포함되므로 하위호환 타이틀이나 이전 연도 출시작은 제외되는 구조입니다. 흥미롭게도 Xbox Series X|S 플랫폼 단일 랭킹에서는 포르자 호라이즌 6이 최고 평점을 기록하지 않은 것으로 보이는데, 이는 플랫폼별 리뷰 수 편차에서 비롯된 결과로 추정됩니다.\n\n이번 성과는 마이크로소프트의 내재 개발(Xbox Game Studios) 강화 전략과 기존 IP 활용을 통한 AAA급 타이틀 공급의 효과를 입증합니다. 특히 Game Pass 구독 서비스에 신작 포르자 호라이즌 6을 런칭 타이틀로 제공함으로써, 하드웨어 판매와 구독자 확보라는 이중 목표를 달성하고 있습니다. PlayStation과의 성능 경쟁이 심화되는 상황에서 Xbox의 기술적 역량과 소프트웨어 품질이 글로벌 시장에서 재평가받는 신호로 읽힙니다.\n\n포르자 호라이즌 6은 Xbox Series X|S 및 PC에서 발매 예정이며, Xbox Game Pass에 포함되어 구독자는 추가 비용 없이 플레이 가능합니다. 정식 구매 시 국내 가격은 약 69,900원(3,000 MSP 환산)대로 예상되며, 한국어 자막 및 인터페이스 지원이 확인된 상태입니다.	{"Xbox Series X|S","포르자 호라이즌 6",독점작,메타크리틱,"Game Pass",AAA게임}	PUBLISHED	2026-05-19 11:03:30.805	2026-05-19 11:03:30.805	0
cmpcipdd20012aa8a29g6cdy4	에버플래닛 IP 부활하나, '넥슨 리플레이' 프로젝트 공개	https://www.gamemeca.com/view.php?gid=1775333	2026-05-18 10:22:41	게임메카	기타	기타 기타	claude	넥슨, 레거시 IP 재탄생 프로젝트 '넥슨 리플레이' 공개	넥슨이 외부 창작자에게 IP를 개방하는 '넥슨 리플레이' 프로젝트를 통해 에버플래닛 등 여러 게임을 새롭게 해석하도록 지원한다.	넥슨이 자사 IP를 외부 개발사에 개방하는 '넥슨 리플레이' 프로젝트를 시작했다. 이 프로젝트는 검증된 IP를 바탕으로 원작 감성을 유지하면서도 새로운 해석을 가능하게 하는 협업 구조로, 여러 개발사가 동시에 같은 IP를 활용할 수 있는 비독점 방식이 특징이다.\n\n넥슨은 참여 개발사의 초기 진입 장벽을 낮추기 위해 그래픽 리소스와 소스 코드를 제공하며, 프로젝트 매출의 일정 비율을 배분하는 로열티 구조를 마련했다. 이를 통해 기존 게임의 팬덤을 활용하면서도 새로운 플랫폼과 장르로의 확장을 동시에 추진할 수 있게 설계했다.\n\n현재 진행 중인 프로젝트는 다양한데, 에버플래닛은 러쉬에잇이 MMORPG로 개발 중이고, 택티컬 커맨더스는 초가소프트가 리마스터 버전을 준비 중이다. 일랜시아와 어둠의전설도 각각 리마스터 MMORPG와 모바일 RPG로 재해석되고 있으며, 넥슨은 연내 첫 결과물 공개를 목표로 개발 속도를 높이고 있다.	{넥슨,게임IP,협업프로젝트}	PUBLISHED	2026-05-19 10:56:19.431	2026-05-19 10:56:19.431	0
cmpcipi6j0013aa8avbqgd4hf	20주년 기념 영화관 테마 팝업 '아이모 시네마' 성료	https://www.gamemeca.com/view.php?gid=1775332	2026-05-18 10:09:21	게임메카	기타	기타 기타	claude	아이모, 20주년 기념 영화관 테마 팝업 성황리에 종료	컴투스의 모바일 MMORPG 아이모가 20주년을 기념하는 팝업 전시회를 성공적으로 마쳤다.	컴투스는 모바일 MMORPG 아이모의 20주년을 기념하는 팝업 전시회 '아이모 시네마'를 5월 16일부터 17일까지 서울 성수동에서 개최하고 성료했다. 사전 예약이 전 회차 조기 매진될 정도로 팬들의 관심이 높았으며, 현장에는 이틀간 지속적인 발길이 이어져 20년 역사에 대한 유저들의 애정을 보여줬다.\n\n전시장에는 대형 LED 화면에 20주년 축하 영상이 상영되었고, 피처폰 시절부터 현재까지의 게임 발자취를 담은 자료들이 전시되었다. 방문객들은 메모지에 축하 메시지를 작성하며 픽셀 캐릭터를 완성하고, 주요 캐릭터가 꾸며진 포토존에서 기념사진을 촬영했으며, 캡슐 뽑기 이벤트에도 참여했다.\n\n장시간 게임을 즐겨온 유저들은 초창기 플레이 화면 등 전시물 앞에서 추억을 회상하며 의미 있는 시간을 가졌다. 전시회 첫날에는 온·오프라인 소통 방송 '아이모 시네마 라이브'가 진행되어 현장의 열기를 전 세계 플레이어와 공유했고, 향후 새로운 콘텐츠 '헌팅 그라운드' 도입 등 미래 계획도 공개했다.	{아이모,컴투스,20주년,팝업전시회,모바일게임}	PUBLISHED	2026-05-19 10:56:25.675	2026-05-19 10:56:25.675	0
cmpcipria0014aa8adpvtkgss	Prominent PS5 Podcaster's Account Hacked, Social Engineering Concerns Amplified	https://www.pushsquare.com/news/2026/05/prominent-ps5-podcasters-account-hacked-social-engineering-concerns-amplified	2026-05-19 00:30:00	Push Square	Console	PlayStation	fixed	PlayStation 5 커뮤니티 경고: 유명 팟캐스터 PSN 계정 해킹, '소셜 엔지니어링' 공격 확산	PS5 팟캐스트 '세이크리드 심볼즈'의 진행자 콜린 모리어티의 PSN 계정이 해킹당하면서, 플레이스테이션 커뮤니티 전역에서 소셜 엔지니어링 공격 우려가 급증하고 있습니다. 업계 인물의 계정 탈취는 일반 유저들의 보안 위협 심각성을 재조명했습니다.	PS5 게이밍 커뮤니티의 영향력 있는 인물인 콜린 모리어티가 자신의 PSN 계정 접근 권한을 잃었다고 소셜 미디어를 통해 공식 확인했습니다. 'Sacred Symbols' 팟캐스트 창립자이자 전 IGN 플레이스테이션 에디터인 모리어티의 계정 해킹 사건은 단순한 개인 보안 사고를 넘어, 플레이스테이션 팬덤 전체에 만연해 있던 '소셜 엔지니어링' 공격 위협을 수면 위로 부상시켰습니다.\n\n소셜 엔지니어링은 기술적 취약점이 아닌 인적 심리를 악용한 사기 기법으로, 피해자에게 비밀번호나 개인정보를 자발적으로 제공하도록 유도합니다. PSN 계정의 경우 구독료 결제 수단, 게임 라이브러리, 그리고 개인 데이터가 연결되어 있어 해킹 시 재정적·개인정보 유출 피해가 심각합니다. 모리어티와 같은 공인의 계정이 표적이 되었다는 것은, 해커들이 영향력 있는 계정을 우선적으로 노리고 있음을 시사합니다.\n\n소니는 지난 몇 년간 PSN 보안 강화에 투자해왔으나, 2단계 인증(2FA) 설정 미비자들이 여전히 다수 존재하는 상황입니다. 이번 사건은 플레이스테이션 유저들에게 △강력한 고유 비밀번호 설정 △2단계 인증 필수 활성화 △의심스러운 이메일 링크 회피 등의 기본 보안 수칙의 중요성을 다시 한 번 강조했습니다. 소니 측은 피해자 계정 복구 지원 및 추가 보안 조치 강화 계획을 내부적으로 검토 중인 것으로 알려졌습니다.\n\n【국내 유저 가이드】 PSN 계정 보안 강화 절차는 PlayStation 공식 웹사이트(playstation.com) 내 '계정 관리' 섹션에서 무료로 진행할 수 있습니다. 특히 한국 유저는 △이중 인증(2FA) 활성화 △로그인 알림 설정 △신뢰할 수 없는 기기에서의 자동 로그아웃 기능을 필수로 활성화할 것을 권장합니다. 해킹 의심 시에는 공식 지원 웹사이트(support.playstation.com/ko-kr)를 통해 긴급 신고 가능합니다.	{PlayStation,"PSN 보안","소셜 엔지니어링","계정 해킹","소비자 보안경고"}	PUBLISHED	2026-05-19 10:56:37.762	2026-05-19 10:56:37.762	0
cmpcipzhm0015aa8a74yt65d4	Poll: Sony's Killing Its PS5 PC Ports - But Do You Agree with Its Decision?	https://www.pushsquare.com/features/poll-sonys-killing-its-ps5-pc-ports-but-do-you-agree-with-its-decision	2026-05-19 00:00:00	Push Square	Console	PlayStation	fixed	PlayStation 5, PC 포트 전략 전면 재검토... 싱글플레이 독점작 정책 복귀	소니가 PS5 싱글플레이 게임의 PC 포트 계획을 전면 취소하기로 결정했으며, 이는 PS Plus 요금 인상과 함께 플레이스테이션 에코시스템의 독점성 강화 신호로 해석되고 있다.	소니가 PS5 싱글플레이 게임의 PC 이식을 중단하기로 방향을 바꿨다. Bloomberg 기자 Jason Schreier가 보도한 바에 따르면, PlayStation Studios 수장 Hermen Hulst가 주재한 내부 타운홀 미팅에서 이 같은 결정이 공식화됐다. 그간 소니는 'God of War Ragnarök', 'Horizon Zero Dawn' 등 AAA 싱글플레이 타이틀을 PC로 이식하며 멀티플랫폼 전략을 추진했으나, 이제 그 노선에서 완전히 벗어나겠다는 입장을 밝힌 것이다.\n\n이 결정은 PS Plus 요금 인상 발표와 동시에 나왔다는 점에서 소니의 전략적 재편을 시사한다. 싱글플레이 게임을 PS5 독점으로 유지함으로써 하드웨어 판매 동인을 강화하되, 동시에 PS Plus Premium 구독 가치를 높여 정기 수익원을 확보하려는 의도로 읽힌다. 이는 과거 'Marvel's Spider-Man 2', 'Final Fantasy VII Remake' 같은 주요 독점작이 PC로 이식되며 독점성이 약화된 것에 대한 보정책으로 해석된다.\n\n소니의 이번 결정은 업계 파편화 심화를 초래할 가능성이 있다. Microsoft는 Xbox Game Pass를 통해 PC와 콘솔 간 '플레이 애니웨어(Play Anywhere)' 정책을 강화 중이며, Nintendo는 독점성 중심의 폐쇄형 생태계를 유지하고 있다. 소니가 다시 독점성으로 회귀한다면, 게이머들은 각 플랫폼의 독점작을 경험하기 위해 멀티 플랫폼 구매를 감수해야 하는 상황이 심화될 것으로 보인다. 특히 고가 AAA 게임의 경우 구입 결정이 더욱 신중해질 가능성이 높다.\n\n현재 소니는 공식 성명을 발표하지 않았으며, 향후 발표될 PS5 신작들이 어느 정도 이 정책의 영향을 받을지 확정되지 않았다. 국내 PlayStation 유저의 경우 PC 플랫폼 옵션이 제거되는 만큼 PS5 하드웨어 구매 결정이 더욱 중요해질 것으로 예상된다. 구체적인 정책 적용 시점과 예외 게임의 범위에 대해서는 소니의 후속 공식 발표를 주시할 필요가 있다.	{"PlayStation 5","PC 포트","독점 정책","PS Plus 요금 인상","글로벌 전략"}	PUBLISHED	2026-05-19 10:56:48.106	2026-05-19 10:56:48.106	0
cmpciq8z10016aa8abo6h6zlr	Feature: 'It Should Be Free to Play Online Games': PS Plus Price Squeeze Taken to Task by PS5 Owners	https://www.pushsquare.com/features/it-should-be-free-to-play-online-games-ps-plus-price-squeeze-taken-to-task-by-ps5-owners	2026-05-18 23:00:00	Push Square	Console	PlayStation	fixed	PlayStation Plus 월간 구독료 인상에 PS5 유저 반발... '온라인 플레이는 기본권이어야' 목소리 확산	소니가 PlayStation Plus Essential의 월간/분기 구독료를 인상하면서 국내 PS5 유저들 사이에서 '온라인 플레이의 유료화 정책'에 대한 비판이 고조되고 있으며, 연간 구독 가격 동결 전략이 연 구독 강제 유도 의도로 해석되고 있다.	소니가 PlayStation Plus Essential의 월간 및 분기 구독료를 인상하기로 결정하면서 글로벌 PS5 커뮤니티에서 거센 반발이 일고 있다. 특히 주목할 점은 소니가 연간 구독 가격은 현 수준으로 동결한 반면, 단기 구독료만 선별적으로 올린다는 전략인데, 이는 결국 유저들을 연 구독으로 유도하려는 의도로 읽혀 비판을 받고 있다. 온라인 멀티플레이는 현대 콘솔 게이밍의 핵심 요소인 만큼, 기본 게임 플레이마저 유료 구독을 강제하는 정책에 대해 '온라인 게임 플레이는 기본권이어야 한다'는 주장이 확산 중이다.\n\n이번 가격 인상은 Xbox Game Pass의 지속적인 공격적 마케팅과 닌텐도 Switch Online의 저가 구독 정책 등 경쟁사의 전략과 비교되면서 소니의 자존심 있는 결정으로 평가받지 못하고 있다. 특히 일부 커뮤니티에선 'PC 게이밍으로 전환하겠다'는 의견까지 나오고 있어, 소니의 구독 정책이 역으로 플랫폼 이탈을 유발할 가능성도 제기되고 있다. 연간 구독 동결 정책만으로는 이 같은 불만을 상쇄하기 어려운 상황으로 보인다.\n\n업계 전문가들은 소니가 PlayStation Plus 구독자 수의 단순 증가보다는 '높은 구독료 유지'를 통한 평균 수익(ARPU, Average Revenue Per User) 극대화에 집중하고 있다고 분석하고 있다. 하지만 이 같은 수익성 중심 정책은 Nintendo Switch Online의 저가 전략($20/년)과 Xbox Game Pass의 가치 제안(신작 멀티플레이타이틀 즉시 포함)에 비해 PS Plus Essential의 경쟁력을 약화시킬 수 있다는 우려가 나온다. 소니가 고급 서비스인 PS Plus Extra/Premium으로의 업그레이드 유도에 집중하고 있다는 점도 고려할 필요가 있다.\n\n**국내 유저 필독 정보:**\n- **한국 PS Plus Essential 월간 구독료**: 약 9,900원 (정식 출시 기준, 소니 공식 구독 페이지 확인 권장)\n- **한국어 지원**: PlayStation Network 모든 구독 플랜에 완벽 지원\n- **추천 구매 전략**: 연간 구독(약 79,900원)이 월간 구독(9,900원×12개월=118,800원)보다 약 33% 저렴하므로, 장기 이용 계획이 있다면 연 구독이 필수\n- **출시 일정**: 가격 인상은 이미 글로벌에 반영된 상태이며, 국내 정가 조정은 소니 공식 공지 대기 중	{"PlayStation 5","PlayStation Plus","구독 서비스","가격 정책",글로벌뉴스}	PUBLISHED	2026-05-19 10:57:00.397	2026-05-19 10:57:00.397	0
cmpciqife0017aa8acuda19nv	Sony Reportedly Confirms Shift Back to PS5 Single Player Exclusive Games	https://www.pushsquare.com/news/2026/05/sony-reportedly-confirms-shift-back-to-ps5-single-player-exclusive-games	2026-05-18 19:30:00	Push Square	Console	PlayStation	fixed	PlayStation Studios, PS5 싱글플레이 독점작 PC 포팅 중단... '플랫폼 독점성' 강화 전략 선회	소니 PlayStation Studios의 Herman Hulst CEO가 내부 회의에서 향후 개발할 서사 중심 싱글플레이 게임들을 PS5 독점으로 유지하겠다는 방침을 공식 확인했다. PC 포팅 정책 철회로 PlayStation 하드웨어 생태계 결집 의도가 명확해졌다.	소니가 PC 멀티플랫폼 정책에서 본격적으로 방향을 틀었다. Bloomberg의 저널리스트 Jason Schreier가 보도한 바에 따르면, PlayStation Studios의 경영진 Herman Hulst는 월요일 타운홀 미팅에서 회사의 서사 중심 싱글플레이 게임들이 'PlayStation 독점 타이틀'로 유지될 것이라고 직원들에게 공식 확인했다. 이는 지난 3월 Schreier의 보도를 공식적으로 재확인한 것으로, 소니의 PC 포팅 전략이 명확한 후퇴 신호를 보낸 것이다.\n\n이 방침 변화는 소니의 플랫폼 전략 재정의를 의미한다. 지난 2년간 소니는 『갓 오브 워 래그나로크』, 『호라이즌 제로 던』 같은 AAA급 싱글플레이 독점작들을 PC로 포팅하며 멀티플랫폼 수익화에 집중했었다. 하지만 업계의 '독점성 희석' 지적과 PS5 하드웨어 판매 둔화에 대응하기 위해 전략을 재구성한 것으로 분석된다. 향후 신작 싱글플레이 타이틀은 출시 초기부터 PS5 독점성을 보장받게 되어, 플레이스테이션 생태계로의 유입 압력이 강화될 전망이다.\n\n이 결정은 PlayStation 5의 생존 전략과도 직결된다. 현재 PS5는 출시 3년을 맞이한 중기 사이클 단계에서 Xbox Series X|S의 Game Pass 공세와 Nintendo Switch 2 출시 예정이라는 이중 압박을 받고 있다. 소니는 '플레이스테이션만의 경험'으로 차별화하는 쪽으로 전술을 재편성했으며, 이는 향후 2-3년간 발표될 PlayStation Studios 신작들의 독점성이 강화된다는 의미다. 동시에 PlayStation Plus 구독자들에게 '생태계 충성도'를 높일 수 있는 전략적 이점도 생긴다.\n\n국내 플레이스테이션 유저들에게 미치는 영향은 제한적이지만 긍정적이다. PS5 독점성이 강화되면 『파이널 판타지 7 리바이스』(2025년 예정), 차기 『그랜드 투어리스모』 등 주요 신작들이 출시 당초부터 PS5 최적화에 집중되므로, 성능과 배치 디자인에서의 경험이 더욱 차별화될 가능성이 높다. 다만 PC로의 포팅 계획이 완전히 폐기되는 것은 아니며, '이미 개발 중인 타이틀'이나 '멀티플레이 중심 게임'의 경우는 별도 검토 대상이 될 것으로 예상된다.	{"PlayStation 5","PlayStation Studios","독점작 정책","소니 하드웨어 전략","PC 포팅",글로벌뉴스}	PUBLISHED	2026-05-19 10:57:12.649	2026-05-19 10:57:12.649	0
cmpcir2jc0019aa8asbpttzvc	'They're Not Just Filler': Edward Actor Hypes Assassin's Creed: Black Flag's New Story Scenes	https://www.pushsquare.com/news/2026/05/theyre-not-just-filler-edward-actor-hypes-assassins-creed-black-flags-new-story-scenes	2026-05-18 18:30:00	Push Square	Console	PlayStation	fixed	PS5 '어쌔신 크리드: 블랙 플래그 리싱크드', 신규 스토리 콘텐츠는 '필러가 아닌 정통 확장'	에드워드 케나웨이 성우 매트 라이언이 리싱크드의 신규 스토리 콘텐츠를 '게임의 핵심 가치를 높이는 본편 확장'으로 평가하며, 팬들의 '단순 채우기' 우려를 일축했다.	유비소프트가 공개한 '어쌔신 크리드: 블랙 플래그 리싱크드'의 신규 스토리 콘텐츠에 대해 현지 팬들 사이에서 '과연 의미 있는 추가 요소인가'라는 의문이 제기돼 온 가운데, 주인공 에드워드 케나웨이의 성우 매트 라이언이 직접 나서 이를 반박했다. 그는 "돌아올 수 있어서 정말 기뻤다"며 신규 스토리 씬들이 "단순한 시간 때우기가 아니라 캐릭터의 깊이를 더하고 메인 플롯을 의미 있게 확장하는 콘텐츠"라고 강조했다.\n\n리싱크드는 원작(2013년 출시)의 기본 스토리 구조를 유지하면서, 캐릭터별 파생 미션과 메인 시나리오의 플롯을 재구성해 게임의 페이싱을 개선하는 방식으로 제작됐다. 팬 커뮤니티에서는 리메이크의 스토리 흐름 개편에 대한 우려의 목소리도 있었으나, 매트 라이언의 발언은 이번 신규 콘텐츠가 원작을 존중하면서도 현대적 재해석을 시도한 결과물임을 시사한다. 성우가 다시 캐릭터를 연기했다는 점도 주목할 만한데, 이는 유비소프트가 단순 그래픽 업그레이드를 넘어 스토리텔링 자체를 강화하려는 의지를 보여준다.\n\n이번 리싱크드는 PS5의 향상된 하드웨어 성능(특히 SSD 속도와 GPU 성능)을 활용해 원작보다 빠른 로딩과 더욱 정교한 해양 탐험 환경을 구현할 수 있게 됐다. 또한 신규 스토리가 추가되면서 PS Plus Premium 구독자 대상 '클래식' 카테고리 타이틀로도 포함될 가능성이 높아, 소니의 게임 구독 생태계 강화 전략과도 맞닿아 있다. 유비소프트는 장기 프랜차이즈 IP의 현대적 재평가를 통해 기존 팬 확보와 신규 유저 유입을 동시에 노리고 있는 셈이다.\n\n'어쌔신 크리드: 블랙 플래그 리싱크드'는 PS5 독점 타이틀로 2024년 5월 15일 글로벌 동시 출시 예정이며, 국내 정식 판매가는 별도 공지 대기 중이다(스탠다드 에디션 기준 해외 소매가 $59.99, 약 78,000원 추정). 한국어 자막은 유비소프트 정식 한글화 지원으로 제공될 것으로 예상되며, PS Store 또는 소매점을 통해 구매 가능할 예정이다.	{"PlayStation 5","어쌔신 크리드: 블랙 플래그 리싱크드",리메이크/리마스터,"글로벌 게임뉴스"}	PUBLISHED	2026-05-19 10:57:38.6	2026-05-19 10:57:38.6	0
cmpcirx8n001daa8a6d6ntbmm	PS Plus Price Increase Announced by Sony for New Members	https://www.pushsquare.com/news/2026/05/ps-plus-price-increase-announced-by-sony-for-new-members	2026-05-18 16:15:00	Push Square	Console	PlayStation	fixed	PlayStation Plus Essential 기본 요금 인상 단행... 신규 가입자 대상 5월 20일부터 적용	소니가 PS Plus Essential의 신규 가입자 요금을 '시장 상황 악화'를 이유로 인상하기로 결정했으며, 월간 및 3개월 구독권이 대상이 된다. 기존 회원이나 12개월 구독권은 현재 요금이 유지될 것으로 보인다.	소니가 PlayStation Plus Essential(기본 플랜)의 가격 인상을 공식 발표했다. 이번 가격 인상은 오는 5월 20일부터 신규 가입자를 대상으로 시행되며, 월간 구독권과 3개월 구독권이 인상 대상에 포함된다. 소니는 인상 사유로 '지속되는 시장 여건 변화'를 언급했으나, 구체적인 인상 폭은 공식 발표에서 명시되지 않았다.\n\n주목할 점은 12개월 연간 구독권은 현행 가격이 유지되는 것으로 보인다는 부분이다. 기존 PS Plus Essential 구독자가 구독을 갱신할 경우에는 현 요금을 적용받지만, 구독이 만료된 후 재가입할 경우 새로운 가격을 지불해야 한다. 이는 장기 구독 사용자와 신규 사용자 간 요금 차등 정책으로, 연간 구독권 구매를 유도하려는 전략으로 해석된다.\n\n이번 가격 인상은 PlayStation 플랫폼 생태계에서 중요한 결정이다. PS Plus Essential은 온라인 멀티플레이 접근권과 월간 무료 게임 제공이 포함된 기본 서비스로, 전 세계 수백만 PS5·PS4 이용자가 의존하고 있다. 소니의 이러한 구독료 인상 움직임은 게임 퍼블리셔들의 수익성 악화와 운영 비용 상승이 반영된 것으로 보이며, 이는 Microsoft의 Xbox Game Pass와의 경쟁 심화 속에서도 수익 구조 강화 필요성을 시사한다.\n\n**국내 구독자 안내**: 한국에서 PS Plus Essential 가입 시 현재 기본 요금(월간 약 9,900원, 연간 약 99,000원)이 적용되고 있으나, 정확한 한국 시장 인상 시점과 가격은 소니 공식 공지를 통해 확인이 필요하다. 기존 구독자라도 구독이 만료될 경우 새로운 가격이 적용되므로, 현행 요금으로 유지하려면 갱신 시점을 주의 깊게 확인해야 한다.	{PlayStation,"PS Plus Essential","구독 서비스","가격 인상",글로벌뉴스}	PUBLISHED	2026-05-19 10:58:18.501	2026-05-19 10:58:18.501	0
cmpcis65d001eaa8alrhpq6vd	Don't Worry, PS5 RPG Dawnwalker's Got a Range of Difficulty Options Despite Its Hardcore Design	https://www.pushsquare.com/news/2026/05/dont-worry-ps5-rpg-dawnwalkers-got-a-range-of-difficulty-options-despite-its-hardcore-design	2026-05-18 16:00:00	Push Square	Console	PlayStation	fixed	PlayStation 5 독점작 '던워커: 블러드', 하드코어 설계 속에도 다양한 난이도 옵션 탑재	렐벨 울브스가 개발 중인 PS5 독점 RPG '던워커: 블러드'가 도전적인 전투와 시간 제약 시스템을 갖춘 하드코어 게임이면서도 폭넓은 난이도 커스터마이징을 지원해, 캐주얼부터 고수까지 모든 유저층을 아우를 것으로 예상된다.	렐벨 울브스의 차기작 '던워커: 블러드'는 의미 있는 선택지와 그에 따른 결과, 그리고 시간 제약이 적용되는 구조의 하드코어 RPG로 알려져 왔다. 특히 도전적인 전투 디자인으로 코어 게이머들의 관심을 끌었으나, 개발팀이 광범위한 난이도 옵션을 게임에 포함시킨 것으로 확인됐다. 이는 젤다의 전설: 왕국의 눈물이나 엘든 링처럼 다양한 플레이 스타일을 수용하는 최근 대작 RPG의 추세와 맥을 같이한다.\n\n공개된 정보에 따르면 '던워커: 블러드'의 난이도 커스터마이징은 단순한 노말/하드 2단계를 넘어, 플레이어의 선호도에 맞춘 세밀한 조정이 가능한 것으로 알려졌다. 시간 제약의 강도, 전투 난이도, NPC 상호작용의 복잡도 등을 개별적으로 설정할 수 있어, 스토리에 몰입하고 싶은 유저도 극악의 난이도에 도전하려는 유저도 자신의 페이스에 맞춰 플레이할 수 있을 전망이다.\n\n이러한 설계 철학은 렐벨 울브스가 노리는 유저층의 확대 전략으로 해석된다. 폴란드의 스튜디오인 렐벨 울브스는 'CD프로젝트 레드'의 구성원들이 독립해 설립한 곳으로, 위처 3의 유산을 이으면서도 신작에서는 보다 포용적인 난이도 정책을 추진하고 있다. PS5의 강화된 SSD 성능과 로딩 시스템을 활용해 시간 제약 구조를 원활하게 구현하는 동시에, 플레이어의 진입장벽을 낮추려는 의도로 보인다.\n\n'던워커: 블러드'의 국내 공식 출시 가격은 아직 확정되지 않았으나, 글로벌 기준 $39.99 USD(약 52,000원대 추정)로 공개된 상태다. PlayStation 5 플랫폼의 PS Plus Extra/Premium 구독 서비스 포함 여부는 후속 공지를 기다려야 한다. 한국어 자막 지원 범위도 개발사를 통해 추가 확인이 필요하며, 정식 출시 시기는 2025년 상반기 예정으로 알려져 있다.	{"PlayStation 5","던워커: 블러드(The Blood of Dawnwalker)","RPG/난이도 옵션","글로벌 뉴스"}	PUBLISHED	2026-05-19 10:58:30.05	2026-05-19 10:58:30.05	0
cmpcisddg001faa8awzbl00f0	GTA 6 Trailer 3 Unlikely Today After Erroneous Pre-Order Emails	https://www.pushsquare.com/news/2026/05/gta-6-trailer-3-unlikely-today-after-erroneous-pre-order-emails	2026-05-18 15:00:00	Push Square	Console	PlayStation	fixed	GTA 6 3차 트레일러, 오늘 공개 가능성 낮아... 록스타 마케팅 일정 재검토 필요	록스타 게임스의 오류 메일 발송으로 촉발된 GTA 6 트레일러 기대감이 무산되면서, 여름 마케팅 시작 공약에 대한 팬들의 신뢰도가 흔들리고 있다.	락스타 게임스의 예약 구매 오류 메일이 발송되면서 GTA 6의 3차 공식 트레일러가 오늘 공개될 것이라는 추측이 제기됐으나, 실제 공개 가능성은 낮은 것으로 확인됐다. 지난 1년 이상 신규 트레일러 소식 없이 부재 중인 상황에서 팬들의 기대가 최고조에 달했으나, 이번 해프닝으로 인한 실망감이 확산하고 있다.\n\n지난주 게임 인포머의 커버스토리 공개도 GTA 6과 무관한 콘텐츠로 드러났으며, 록스타의 '올 여름 마케팅 개시' 공약이 구체적인 일정 확정 없이 남겨져 있는 상태다. 이는 PlayStation 5를 포함한 멀티플랫폼 출시 예정작임을 감안할 때, 소니와의 마케팅 파트너십 조율 과정에서의 지연으로 해석되는 상황이다.\n\n글로벌 게임 시장에서 GTA 프랜차이즈가 차지하는 상징성을 고려하면, 이 같은 공보 관리 미흡은 플레이스테이션 생태계 내 주요 타이틀 정보 공개 신뢰도에도 영향을 미칠 수 있다. 락스타 게임스는 공식 채널을 통해 명확한 트레일러 공개 일정을 재공시할 필요가 있으며, 팬덤의 기대감을 관리하는 단계로 접어들었다고 평가된다.\n\n**국내 정식 발매 정보**: GTA 6의 한국어 자막 지원 여부와 정식 한글화는 아직 확정되지 않았으며, PlayStation 5 버전의 국내 정식 출시 가격도 공식 발표 대기 중이다. 출시일은 2025년 가을로 예정되어 있으나, 마케팅 일정 재조정에 따라 변동 가능성도 있다.	{"PlayStation 5","GTA 6",마케팅,글로벌뉴스}	PUBLISHED	2026-05-19 10:58:39.412	2026-05-19 10:58:39.412	0
cmpcismv8001gaa8aj2fzol16	Gravity Rush 2 Fans Find a Way to Play Sony's Neglected PS4 Classic at 4K, 60fps	https://www.pushsquare.com/news/2026/05/gravity-rush-2-fans-find-a-way-to-play-sonys-neglected-ps4-classic-at-4k-60fps	2026-05-18 13:30:00	Push Square	Console	PlayStation	fixed	PlayStation 4 에뮬레이터로 부활한 '그래비티 러시 2'... 4K 60fps 고주사율 플레이 가능	소니가 방치해온 PS4 독점작 '그래비티 러시 2'가 PC 에뮬레이터를 통해 4K 60fps로 구동되면서 팬들의 재평가 움직임이 확산 중. 공식 재마스터링 부재 속 커뮤니티 주도의 기술적 해결책이 주목받고 있다.	2015년 PS4 출시작이자 소니의 IP 중 하나인 '그래비티 러시 2'(2016)가 PC 에뮬레이션 커뮤니티를 통해 새로운 생명을 얻었다. 코더 준민 리(Junmin Lee)가 개발한 ShadPS4 에뮬레이터의 최신 포크(Fork) 버전을 통해 원작 PS4 버전을 4K 해상도에 60프레임이라는 고주사율로 플레이할 수 있게 된 것. 이는 콘솔 세대 교체 후에도 정식 업그레이드나 재마스터링이 이루어지지 않은 게임이 얼마나 방치되고 있는지를 보여주는 사례로 평가받고 있다.\n\n기술적으로 주목할 점은 원본 PS4 버전의 1080p 30fps라는 제한을 완전히 극복했다는 것. ShadPS4 에뮬레이터는 최근 AMD와 NVIDIA GPU 최적화를 지속적으로 진행 중이며, 준민 리의 포크는 특히 그래비티 러시 2의 복잡한 중력 변환 연산을 PC 하드웨어에서 효율적으로 처리하도록 개선했다. PS4 Pro 버전도 존재하지 않는 상황에서 이는 게임을 가장 고주사율로 경험할 수 있는 유일한 공식 경로(비공식이지만)가 됐다.\n\n이 사례는 소니의 후속 IP 관리 전략에 대한 비판적 질문을 던진다. 그래비티 러시 프랜차이즈는 PS Vita 독점작으로 시작해 PS4까지 이어졌으나, 현재 PS5 세대에서는 신작 소식이 전무한 상태다. 게임 패스나 PS Plus 프리미엄의 클래식 카탈로그 강화 움직임이 활발한 반면, 그래비티 러시 2는 여전히 독립적 구매 대상으로만 취급되고 있다. 에뮬레이터 커뮤니티의 이 같은 기술적 해결책은 궁극적으로 소니가 해야 할 일을 사용자가 대신하고 있다는 의미로도 해석된다.\n\n**국내 플레이 가이드**: 그래비티 러시 2는 현재 PlayStation Store에서 정식 구매 가능하며 한국어 자막을 지원한다. PS4 버전은 약 2만 원대의 세일 가격으로 수시로 할인된다. 다만 4K 60fps 플레이를 원한다면 위 에뮬레이터를 활용한 PC 플레이가 유일한 선택지이며, 이는 기술적 능력과 윤리적 판단을 요하는 결정이다. 공식적으로는 PS4 또는 PS5의 하위호환성을 통한 원본 플레이만 권장된다.	{PlayStation,"그래비티 러시 2",에뮬레이션,"IP 재평가","콘솔 게임"}	PUBLISHED	2026-05-19 10:58:51.716	2026-05-19 10:58:51.716	0
cmpcisxov001haa8axr4vjj4z	Round Up: Disco Elysium's Controversial 'Sequel' Met with Rave Reviews	https://www.pushsquare.com/features/round-up-disco-elysiums-controversial-sequel-met-with-rave-reviews	2026-05-18 13:00:00	Push Square	Console	PlayStation	fixed	PlayStation 유저 필독, '디스코 엘리시움' 후속작 '제로 퍼레이드: 포 데드 스파이즈' 평단 호평	전설적 RPG '디스코 엘리시움'의 정신적 후속작 '제로 퍼레이드: 포 데드 스파이즈'가 PC 출시와 함께 국제 평단으로부터 호평을 받으며, PlayStation 플랫폼 유입 가능성에 주목이 집중되고 있다.	지난 10년간 최고의 RPG 중 하나로 평가받은 '디스코 엘리시움'의 정신적 계승자 '제로 퍼레이드: 포 데드 스파이즈'가 PC 플랫폼에 정식 출시되며 국제 평단의 호평을 받고 있다. 원개발사 ZA/UM과의 법적 분쟁으로 인해 '기술적 후속작'이라는 이례적인 지위로 출시된 이 작품은, 전작의 상징적 세계관과 깊이 있는 내러티브를 계승하면서도 독립적인 게임으로 자리잡았다는 평가를 받고 있다.\n\n평단 리뷰에 따르면 '제로 퍼레이드'는 전작의 장점인 픽셀 아트 스타일의 디테일한 비주얼, 인물 중심의 서사 구조, 그리고 선택지 기반의 RPG 시스템을 충실히 계승했으며, 신규 도시와 캐릭터 설정으로 신선함을 더했다는 점이 호평의 핵심이다. 특히 팀턴 시티(Revachol)와 같은 수준의 '플레이 가능한 배경'으로서의 세계 구축이 돋보진다는 평가가 우세하다. 현재 주요 게임 미디어(PushSquare, Metacritic)에서 80점대 중반의 스코어를 기록 중이며, 인디 RPG의 대안으로서의 위상을 재확인시켰다.\n\n이 작품의 출시는 PlayStation 플랫폼 생태계에도 중요한 신호를 전송한다. 소니가 인디 개발사와의 협력을 강화하면서 독창적 IP 확보에 집중하는 가운데, '제로 퍼레이드'의 성공은 AAA급 대작 위주 출시 전략의 보완재로서 '내러티브 기반 인디 RPG'의 수요층이 두터우며, PlayStation 커뮤니티에서 이러한 작품들에 대한 수요가 상당함을 시사한다. 향후 PlayStation 플랫폼으로의 콘솔 이식 여부가 주목되는 이유다.\n\n**한국 유저 구매 가이드**\n- **출시 플랫폼**: 현재 PC(Steam) 단독 출시 중 / PlayStation 콘솔 이식 미정\n- **정식 가격**: 약 $20~25 USD (국내 환산 약 26,000~32,000원)\n- **한국어 지원**: 완전 한글화 확인됨\n- **플레이 시간**: 약 15~20시간 (전작 대비 소폭 단축)\n- **구매처**: Steam, GOG 등 PC 플랫폼 / PlayStation Network 출시 대기\n\n현재로선 PC 독점 출시이나, 전작 '디스코 엘리시움'이 PS4/PS5로 이식된 선례를 고려하면 향후 PlayStation 플랫폼 지원 가능성이 높은 만큼, 프롤로그 공개 데모를 통해 사전 체험해볼 것을 권장한다.	{PlayStation,"Zero Parades: For Dead Spies","인디 RPG","Disco Elysium","콘솔 이식 기대작","글로벌 뉴스"}	PUBLISHED	2026-05-19 10:59:05.742	2026-05-19 10:59:05.742	0
cmpcit701001iaa8a6ueys60i	Review: LEGO Batman: Legacy of the Dark Knight (PS5) - Brick Gaming at Its Joyful Best	https://www.pushsquare.com/reviews/ps5/lego-batman-legacy-of-the-dark-knight	2026-05-18 12:00:00	Push Square	Console	PlayStation	fixed	PlayStation 5 | LEGO Batman: Legacy of the Dark Knight 리뷰 - '재미'를 최우선으로 한 벽돌 액션의 정점	TT Games의 신작 'LEGO Batman: Legacy of the Dark Knight'는 배트맨 우주의 방대한 설정을 활용하되, 게임플레이의 재미를 절대 타협하지 않은 완성도 높은 PS5 독점작으로 평가받고 있다.	TT Games가 자신의 블록버스터 LEGO 프랜차이즈 개발 노하우를 집대성해 선보인 'LEGO Batman: Legacy of the Dark Knight'가 PlayStation 5에서 기대 이상의 평가를 수집하고 있다. 이 작품은 단순히 배트맨의 유명 스토리를 나열하는 수준을 넘어, 배트맨 유니버스의 광대한 설정과 캐릭터를 '최고의 곡 모음집(Greatest Hits Album)' 방식으로 재구성해 캠페인을 진행한다. 개발진이 모든 설계 단계에서 '이것이 정말 재미있는가?'라는 질문을 놓치지 않았음이 게임 전반에 묻어난다.\n\nPS5의 SSD 기술을 활용한 빠른 로딩과 고주사율 렌더링이 LEGO 블록의 파괴 및 재조합 액션에 즉각적인 반응성을 부여한다. 수천 개의 브릭 오브젝트가 충돌할 때마다 발생하는 물리 연산도 매끄럽게 처리되며, DualSense 컨트롤러의 햅틱 피드백과 적응형 트리거가 각 액션(펀치, 건 발사, 벽돌 조립 등)마다 다른 감각 경험을 전달한다는 점이 주목할 만하다. 화면 찢김 현상 없이 안정적인 60fps 목표를 유지하는 기술적 완성도도 눈에 띈다.\n\n배트맨 관련 게임이 수십 년 축적된 게임 업계에서도, LEGO라는 '완구'의 정체성을 잃지 않으면서도 어른 게이머의 기대를 충족시킨 사례는 드물다. 이는 소니 퍼스트파티 수준의 폴리시(Polish)를 독립 개발사가 아닌 프랜차이즈 개발 전문사가 구현해냈다는 점에서 산업적 의미가 있다. PS Plus 구독자라면 향후 서비스 라인업에 편입될 가능성도 주시할 가치가 있는 대작이다.\n\n**국내 출시 정보**: 한국어 자막 지원이 확인됐으며, PS Store 정식 판매가는 약 59,800원~69,800원대로 예상된다. PlayStation 5 표준 버전 및 Pro 버전 모두 지원하며, PS Plus Premium 구독자는 별도 확인이 필요하다. 현재 글로벌 출시 일정은 2024년 하반기 예정이다.	{"PlayStation 5","LEGO Batman: Legacy of the Dark Knight","액션 어드벤처","PS5 독점","TT Games"}	PUBLISHED	2026-05-19 10:59:17.81	2026-05-19 10:59:17.81	0
cmpcitfuh001jaa8a4r6v1b9k	GTA 6 Originally Meant to Launch 18 Months Ago, But We're Still Waiting for Trailer 3 and Pre-Orders	https://www.pushsquare.com/news/2026/05/gta-6-originally-meant-to-launch-18-months-ago-but-were-still-waiting-for-trailer-3-and-pre-orders	2026-05-18 11:15:00	Push Square	Console	PlayStation	fixed	GTA 6, 원래 계획보다 18개월 지연... PS5 유저들 '예약 판매' 소식에 들뜬 이유	록스타 게임즈의 차기 대작 'GTA 6'이 초기 개발 일정으로부터 18개월 뒤처진 것으로 확인됐으며, 커뮤니티는 곧 예약 판매가 개시될 것으로 예측하고 있습니다.	락스타 게임즈가 개발 중인 차세대 오픈월드 블록버스터 'GTA 6'의 발매 일정이 초기 계획보다 18개월 이상 지연된 것으로 드러났습니다. 이는 게임 개발의 복잡성과 차세대 콘솔(PS5, Xbox Series X/S) 성능에 최적화된 개발 과정에서 비롯된 것으로 보입니다. 지난 최예정 시점에서는 2023년 출시를 목표로 했던 것으로 추정되며, 현재까지 공식 트레일러 3편 공개와 예약 판매 일정이 확정되지 않은 상태입니다.\n\n한편 Best Buy 계열 제휴 판매점들이 GTA 6 예약 판매 링크 활성화 예정 이메일을 배포하면서 커뮤니티는 다시금 출시 임박설에 불을 붙이고 있습니다. 다만 지난 거짓 소식으로 인한 피로도가 쌓인 상태이므로, 공식 발표 전까지 신뢰도가 낮은 상황입니다. 락스타 게임즈의 공식 채널을 통한 정확한 공지가 없는 한, 유통사 단계에서의 내부 시스템 점검으로 해석하는 것이 타당합니다.\n\nGTA 시리즈는 PlayStation 플랫폼에서 가장 수익성 높은 타이틀 중 하나로, PS5용 독점 기술 활용(초고속 SSD를 통한 로딩 시간 최소화, DualSense 햅틱 피드백 구현 등)이 기대됩니다. 18개월 지연이 최종 결과물의 품질과 기술적 완성도 향상으로 이어진다면, PlayStation Plus Premium 구독자들의 출시 후 추가 콘텐츠 패키지 제공 가능성도 배제할 수 없습니다. 또한 이 지연으로 인해 마이크로소프트의 Xbox Game Pass 포함 여부 협상에도 변수가 생겼을 것으로 분석됩니다.\n\n**국내 출시 정보 안내**: GTA 6의 한국어 자막 지원 여부와 정식 국내 발매 가격은 아직 미공개 상태입니다. 글로벌 표준 가격 기준(USD $69.99)을 고려하면 국내 정가는 약 89,000원대로 책정될 가능성이 높으나, 락스타 게임즈의 정식 발표 대기 중입니다. 예약 판매 개시 시점은 2024년 상반기 중으로 예상되며, PlayStation Store 및 소매점(GameSpot, Gmarket 등)에서 동시 판매 예정입니다.	{"PlayStation 5","GTA 6",오픈월드,"출시 지연"}	PUBLISHED	2026-05-19 10:59:29.273	2026-05-19 10:59:29.273	0
cmpcitpca001kaa8abdjwz5la	Guide: These 24+ New PS5 and PS Plus Games Are Coming Out This Week (18th-24th May)	https://www.pushsquare.com/guides/these-24plus-new-ps5-and-ps-plus-games-are-coming-out-this-week-18th-24th-may	2026-05-18 11:00:00	Push Square	Console	PlayStation	fixed	PlayStation 5, 5월 18~24일 주간 24개 신작 대거 출시... 'LEGO 배트맨: 다크나이트의 유산' 포함	LEGO 배트맨, 워해머 40K 스핀오프 등 다양한 장르의 신작이 PS5와 PS Plus 라인업에 합류하면서 국내 유저들을 위한 선택지가 대폭 확대된다.	PS5와 PS Plus 가입자들을 위해 5월 18일부터 24일까지 한 주간 24개 이상의 신작이 연달아 출시된다. 이번 주간 라인업의 절대 강자는 개발사 Traveller's Tales가 개발한 'LEGO 배트맨: 다크나이트의 유산(LEGO Batman: Legacy of the Dark Knight)'으로, DC 코믹스의 상징적 히어로를 LEGO 프랜차이즈만의 유머러스한 터치로 재해석한 액션-어드벤처 타이틀이다. 복합 퍼즐 해결과 캐릭터 변신 메커니즘을 중심으로 한 게임플레이는 시리즈 전작들과의 연속성을 유지하면서도 차세대 콘솔의 그래픽 성능을 활용한 향상된 비주얼을 제공할 것으로 예상된다.\n\n주목할 만한 신작 중에는 Games Workshop의 IP를 기반으로 한 'Warhammer 40,000: Speed Freeks'도 포함돼 있다. 이 타이틀은 기존의 턴 기반 또는 실시간 전술 시뮬레이션과는 달리 아케이드 스타일의 고속 레이싱 게임으로, 워해머 우주관의 차량 전투를 새로운 관점에서 재구성했다. 추가로 '버시 4D(Bubsy 4D)'와 같은 클래식 복고풍 플랫폼 게임부터 인디 개발사의 다양한 타이틀까지 포진해 있어, 캐주얼 유저부터 하드코어 플레이어까지 아우르는 구성이다.\n\n이러한 대량의 신작 출시는 소니의 PS Plus 전략의 일환으로 해석된다. 월간 구독 서비스의 가치를 높이기 위해 정기적으로 신작을 라인업에 추가하는 방식으로, 구독자 유지율을 제고하는 동시에 멀티플랫폼 인디 개발사들에게도 배급 기회를 제공하는 선순환 구조를 이루고 있다. 특히 LEGO 배트맨 같은 메가 IP 타이틀의 포함은 PS Plus Extra/Premium 계층 가입자들에게 즉시 플레이 가능한 콘텐츠로 제공되므로, 서비스의 실질적 경쟁력 강화 효과가 크다.\n\n**국내 유저 가이드:**\n- **한국어 지원 여부**: LEGO 배트맨은 한국어 자막 지원 예정, 음성은 영어 기본 제공 / 워해머 40K 스핀오프는 영문 전용\n- **정식 출시 가격**: LEGO 배트맨 69,800원대(PS5 스탠다드 에디션 기준), PS Plus Extra 이상 가입 시 추가 비용 없음\n- **구매 플랫폼**: PlayStation Store 직구 또는 PS Plus 구독 서비스를 통한 라이선싱 방식\n- **출시 일정**: 한국 시간 5월 19일(월) 오전 기준 순차 공개	{"PlayStation 5","PS Plus","LEGO 배트맨","신작 라인업","구독 서비스"}	PUBLISHED	2026-05-19 10:59:41.578	2026-05-19 10:59:41.578	0
cmpciyt1l0025aa8a9kf46yi3	50+ Games Are Reduced By 90-95% In The Latest Xbox Sales, Including Some Unlikely Gems	https://www.purexbox.com/news/2026/05/50plus-games-are-reduced-by-90-95percent-in-the-latest-xbox-sales-including-some-unlikely-gems	2026-05-17 13:00:00	Pure Xbox	Console	Xbox	fixed	Xbox, ID@Xbox 메가 세일 진행 중... 50개 이상 타이틀 90~95% 할인	Xbox가 진행 중인 대규모 인디 게임 세일에서 Golf With Your Friends, Zombie Army Trilogy 등 평소 할인이 드물던 숨은 명작까지 90% 이상 폭탄 할인을 제공하고 있다.	Xbox가 ID@Xbox 메가 세일을 통해 50개 이상의 게임 타이틀을 90~95% 할인하고 있어 국내 Xbox 유저들의 관심이 집중되고 있다. 이번 세일은 수일 전부터 진행 중인 것으로 확인됐으며, 마이크로소프트가 인디 개발사 지원 정책의 일환으로 정기적으로 추진하는 대규모 프로모션이다.\n\n세일 대상 게임 중에는 Golf With Your Friends, Zombie Army Trilogy & 4, TMNT: Splintered Fate, Soulstice, The Shadow Warrior Trilogy 등 평소에는 거의 할인되지 않는 인디 명작들이 대거 포함돼 있다. 특히 이들 게임은 일반적으로 10~30% 선에서만 할인되어 왔기 때문에, 90% 이상의 폭탄 할인은 상당히 이례적이라 할 수 있다. Xbox Game Pass 구독자가 아닌 게임 구매층에게는 이번이 라이브러리를 저가에 확충할 수 있는 황금 기회가 될 것으로 예상된다.\n\n이러한 인디 게임 세일은 마이크로소프트의 생태계 강화 전략과도 맞닿아 있다. Xbox Game Pass에는 이미 수백 개의 인디 타이틀이 포함되어 있지만, 구독 서비스 비가입자들의 구매 진입장벽을 낮춤으로써 플랫폼 활성화를 도모하는 의도로 해석된다. 또한 ID@Xbox 개발사들의 수익성 개선에도 기여해 생태계 내 개발자 유입을 늘리는 간접적 효과도 기대할 수 있다.\n\n**국내 유저 가이드**: Xbox 스토어의 세일 페이지에서 직접 할인 타이틀을 확인할 수 있으며, 대부분의 인디 게임이 기본적으로 영어로 제공되지만 일부 타이틀은 자막 한국어 지원을 제공한다. 세일 기간은 별도 공지가 없는 한 보통 1~2주간 지속되므로, Xbox 앱을 통해 실시간으로 가격 변동을 모니터링할 것을 권장한다.	{Xbox,ID@Xbox,"인디 게임",세일}	PUBLISHED	2026-05-19 11:03:39.656	2026-05-19 11:03:39.656	0
cmpciz13i0026aa8a7rlbxybl	'Xbox Or XBOX?' - Asha Sharma Hints At Rebrand Based On Poll Results	https://www.purexbox.com/news/2026/05/xbox-or-xbox-asha-sharma-hints-at-rebrand-based-on-poll-results	2026-05-17 11:00:00	Pure Xbox	Console	Xbox	fixed	Xbox, 브랜드 리뉴얼 신호탄... CEO의 투표 결과 '올캡스' 표기 압도적 지지	마이크로소프트 Xbox 부문 CEO 아샤 샤르마가 소셜 미디어 투표를 통해 브랜드 표기법 개편 의사를 드러냈으며, 'XBOX'(올캡스) 표기가 약 65%의 압도적 지지를 얻으며 리브랜딩 추진 가능성을 시사했다.	마이크로소프트가 Xbox 브랜드의 시각적 정체성 개편을 추진할 수 있다는 신호가 포착됐다. 지난주 Xbox 부문 CEO 아샤 샤르마는 공식 소셜 미디어 계정을 통해 'Xbox' vs 'XBOX' 중 어느 표기가 더 나은지를 묻는 투표를 진행했으며, 해당 게시물은 210만 뷰를 기록하며 광범위한 관심을 끌었다.\n\n투표 결과는 'XBOX'(올캡스) 표기에 대한 압도적인 지지로 귀결됐다. 1만 9천 명 이상이 참여한 이번 투표에서 XBOX 표기가 약 65%의 지지율을 기록하며 현재의 'Xbox' 표기를 크게 앞돌았다. 이는 단순한 의견 수렴 차원을 넘어, 마이크로소프트가 브랜드 리프레시를 검토 중임을 시사하는 신호로 해석된다.\n\n이러한 움직임은 Xbox 플랫폼의 장기적 마케팅 전략과 맞닿아 있다. 마이크로소프트는 최근 Xbox Game Pass 가입자 대규모 할인, 신작 출시 일정 조율 등으로 구독 서비스 중심의 사업 모델을 강화하고 있는 가운데, 브랜드 시각화 개편은 새로운 세대의 게이머들에게 더 강렬한 임팩트를 전달하려는 의도로 풀이된다. 특히 'XBOX'라는 올캡스 표기는 강렬함과 현대성을 부각시켜 경쟁사인 PlayStation과의 브랜드 차별화를 강화할 수 있는 수단으로 기능할 것으로 예상된다.\n\n현재 마이크로소프트는 공식적인 브랜드 변경 일정을 발표하지 않았으나, CEO의 투표 진행 자체가 조직 내부 검토 과정 중 대외 여론 수집 단계로 판단된다. 국내 Xbox 유저들은 향후 공식 웹사이트, 마케팅 자료, 콘솔 UI 등에서 XBOX 표기가 점진적으로 적용될 가능성에 주목할 필요가 있다. 현재로서 한국 마이크로소프트 공식 채널에서는 'Xbox' 표기를 유지 중이며, 브랜드 변경과 관계없이 Xbox 게임의 한국어 지원 정책이나 가격 책정에는 영향을 미치지 않을 것으로 예상된다.	{Xbox,마이크로소프트,"브랜드 리뉴얼","글로벌 뉴스"}	PUBLISHED	2026-05-19 11:03:50.095	2026-05-19 11:03:50.095	0
cmpciz9a40027aa8ab05pbrmz	Talking Point: So, Did You Cave And Buy Early Access For Forza Horizon 6?	https://www.purexbox.com/features/talking-point-so-did-you-cave-and-buy-early-access-for-forza-horizon-6	2026-05-16 15:00:00	Pure Xbox	Console	Xbox	fixed	Xbox, '포르자 호라이즌 6' 얼리 액세스 시작... 프리미엄 업그레이드 가격 논란	포르자 호라이즌 6이 얼리 액세스로 출시된 가운데, 프리미엄 업그레이드를 통한 조기 플레이 옵션이 고가격대에 제시되면서 국내 유저들의 관심이 집중되고 있습니다.	Xbox 게임 스튜디오의 자동차 경주 게임 '포르자 호라이즌 6'이 5월 16일부터 얼리 액세스를 시작했습니다. 플레이그라운드 게임즈는 프리미엄 업그레이드 패키지를 통해 선택지를 제공했지만, 조기 플레이를 위한 추가 비용이 상당한 수준인 것으로 알려졌습니다.\n\n프리미엄 업그레이드에는 향후 출시될 두 개의 확장팩(DLC)이 포함되어 있으며, 현지 게이머들 사이에서는 이것이 실질적인 가치 제안인지에 대한 의견이 엇갈리고 있습니다. 다만 정규 출시 전에 리뷰가 이미 공개되어 게임의 완성도와 콘텐츠 규모를 미리 확인할 수 있다는 점은 구매 결정에 긍정적으로 작용하고 있습니다. 포르자 호라이즌 시리즈는 Xbox 플랫폼의 대표 독점작으로, Game Pass 구독자들도 정규 출시 이후 추가 비용 없이 플레이 가능할 예정입니다.\n\n얼리 액세스 방식의 게임화(게임이피케이션)는 AAA 타이틀에서 점점 보편화되고 있지만, 암호화폐나 NFT 게임과 달리 스포츠 레이싱 장르의 특성상 '패스(pass) 시스템' 수익화와 맞물려 다양한 마네타이제이션 전략이 복합적으로 적용된 모습입니다. 마이크로소프트는 Xbox Game Pass 가입층의 활성화를 위해 정규 출시 직후 서비스 추가를 통해 여러 플레이 층을 포섭할 계획으로 보입니다.\n\n포르자 호라이즌 6은 5월 20일 정규 출시 예정이며, Game Pass Ultimate 가입자는 얼리 액세스 기간 중 추가 구독료 없이 플레이 가능합니다. 한국어 자막 지원은 시리즈의 전통을 따를 것으로 예상되며, Xbox Series X|S 및 PC 플랫폼을 통해 동시 출시될 예정입니다. 프리미엄 업그레이드 가격은 국내 기준 약 15,000원대로 예상되나, 정확한 원화 가격은 마이크로소프트 공식 공지를 통해 확인 필수입니다.	{Xbox,"포르자 호라이즌 6","Game Pass","얼리 액세스","프리미엄 업그레이드"}	PUBLISHED	2026-05-19 11:04:00.699	2026-05-19 11:04:00.699	0
cmpcizgil0028aa8awi4h3v95	Five Games Are Confirmed For Xbox Game Pass In June 2026 So Far	https://www.purexbox.com/news/2026/05/five-games-are-confirmed-for-xbox-game-pass-in-june-2026-so-far	2026-05-16 13:30:00	Pure Xbox	Console	Xbox	fixed	Xbox Game Pass, 6월 신작 라인업 공개... 현재까지 5종 타이틀 확정	Xbox Game Pass가 2026년 6월 예정작 5종을 공식 확인했으나, 일부 타이틀의 정확한 출시일은 추후 공개될 예정으로 알려졌다.	마이크로소프트의 구독 서비스 Xbox Game Pass가 6월 신작 라인업의 초기 정보를 공개했다. 현재까지 5개의 타이틀이 6월 중 출시 예정으로 등록되어 있으나, 일부 게임의 정확한 출시일은 아직 미정 상태다. 이는 Xbox Game Pass가 매월 정기적으로 공개하는 신규 타이틀 일정 공지 과정 중 조기 공개된 정보로, 구체적인 날짜 확정은 이후 별도 공지를 통해 진행될 것으로 예상된다.\n\n현재 확인된 5종의 게임은 모두 6월 내 출시 예정이지만, 구독자들이 라이브러리에 추가할 수 있는 정확한 날짜는 향후 마이크로소프트의 추가 발표를 기다려야 한다. Xbox Game Pass는 매월 초중순에 예정작의 확정 일정을 공개하는 것을 관례로 하고 있으며, 이번 6월 라인업도 이 같은 관례를 따를 것으로 보인다.\n\nXbox Game Pass는 전 플랫폼(Xbox Series X/S, PC, 클라우드)을 아우르는 게임 구독 서비스로서, 신규 타이틀 확충을 통해 Xbox 생태계의 가입자 이탈을 방지하고 있다. 6월 신작 라인업의 규모와 장르 다양성은 향후 공식 발표를 통해 더욱 명확해질 것이며, 국내 Xbox Game Pass 이용자들도 한국 계정으로 동일한 일정에 이들 게임을 접할 수 있을 것으로 예상된다.\n\n**【국내 유저 가이드】**\n- **구독료**: Xbox Game Pass for Console(Xbox) 월 11,900원 / Xbox Game Pass for PC 월 11,900원 / Xbox Game Pass Ultimate(전 플랫폼 + Game Pass for PC) 월 16,900원\n- **한국어 지원**: 6월 신작의 한국어 지원 여부는 각 게임사 개별 공지 대기\n- **출시 예정**: 2026년 6월 (정확한 날짜는 추후 공식 발표)\n- **이용 플랫폼**: Xbox Series X/S, Xbox One, Windows PC, 클라우드 게임(Game Pass Ultimate 가입 시)	{"Xbox Game Pass","6월 신작","구독 서비스",마이크로소프트}	PUBLISHED	2026-05-19 11:04:10.077	2026-05-19 11:04:10.077	0
cmpcizqjh0029aa8an7d1qq7f	Feature: These 30+ Games Are Coming To Xbox Next Week (May 18-22)	https://www.purexbox.com/features/these-30plus-games-are-coming-to-xbox-next-week-may-18-22	2026-05-16 12:00:00	Pure Xbox	Console	Xbox	fixed	Xbox, 5월 18-22일 신작 30개 이상 쏟아낸다... '포르자 호라이즌 6' 표준판·'레고 배트맨' 동시 출시	Xbox는 다음 주 4일간 포르자 호라이즌 6 표준판과 레고 배트맨: 다크 나이트의 유산 등 30개 이상의 신작을 공개했으며, Game Pass 신작 2종도 함께 추가돼 가입자들의 선택지가 대폭 확대될 예정이다.	Xbox는 5월 18일부터 22일까지 진행되는 한 주간 30개 이상의 신작 게임을 플랫폼에 배치한다. 이 중 가장 주목할 타이틀은 레이싱 장르의 최강자 '포르자 호라이즌 6' 표준판과 DC 코믹스의 악명 높은 광대 빌런을 주인공으로 한 '레고 배트맨: 다크 나이트의 유산'이다. 두 게임 모두 Xbox 플랫폼과 PC에서 동시 출시될 예정으로, 콘솔 독점작이 아닌 멀티플랫폼 타이틀이지만 Xbox 유저의 첫 진입점으로서의 가치가 크다.\n\nSpecial 관심사는 Game Pass 신규 추가작이다. 공식 발표에 따르면 이번 주차에만 2개의 Game Pass 신작이 추가되는데, 그 중 하나가 '루나 어비스'로 확인됐다. 루나 어비스는 심해 탐험을 배경으로 한 생존 어드벤처 게임으로, Game Pass 가입자는 추가 비용 없이 즉시 플레이할 수 있다. 이는 Microsoft가 Game Pass의 가치 유지를 위해 지속적으로 AAA급 신작과 인디 대작들을 선별적으로 추가하는 전략의 일환으로 풀이된다.\n\n이러한 공세는 5월 말 시장 경기의 흐름 속에서 의미가 있다. 포르자 호라이즌 6는 차량 튜닝의 세밀함과 최신 그래픽 기술(레이 트레이싱, 고주사율 지원)을 강조하는 Xbox Series X|S의 하드웨어 성능을 직결적으로 어필하는 작품이며, 가족 친화적인 레고 배트맨은 폭넓은 플레이어층 확보를 노린 전략이다. Game Pass 신작 추가로 구독 서비스의 '신선도'를 지속해서 강조함으로써, Nintendo Switch Online이나 PlayStation Plus와의 경쟁에서 가치 우위를 다시 한 번 부각할 의도가 드러난다.\n\n**국내 출시 정보**: 포르자 호라이즌 6 표준판은 Xbox, PC 플랫폼에서 5월 18일 정식 출시되며, 국내 정가는 약 79,800원대로 예상된다(마이크로소프트 공식 스토어 기준). 한국어 자막 지원 여부는 개발사 턴텐(Playground Games) 공식 발표를 참조할 필요가 있으나, 포르자 시리즈는 글로벌 메이저 타이틀로서 국내 한국어 자막 지원 가능성이 높다. 레고 배트맨: 다크 나이트의 유산도 동일 날짜 멀티플랫폼 출시 예정이며, Game Pass 구독자(Game Pass Ultimate 19,900원/월)는 동시에 무제한 플레이 가능하다.	{"Xbox Series X|S","포르자 호라이즌 6","레고 배트맨","Game Pass","신작 정보"}	PUBLISHED	2026-05-19 11:04:23.07	2026-05-19 11:04:23.07	0
cmpcizypm002aaa8atxiwt86t	Talking Point: What Are You Playing This Weekend? (May 16-17)	https://www.purexbox.com/features/talking-point-what-are-you-playing-this-weekend-may-16-17	2026-05-16 11:00:00	Pure Xbox	Console	Xbox	fixed	Xbox 커뮤니티, 포르자 호라이즌 6 얼리 액세스 개시... '일본 배경' 오픈월드 경험기	포르자 호라이즌 6의 얼리 액세스가 개시되면서 Xbox 유저들의 주말 게임 선택지가 크게 달라질 것으로 예상된다. 일본을 배경으로 한 신작 레이싱 게임의 등장으로 Game Pass 구독자들의 동시 접속 수 증가가 임박했다.	포르자 호라이즌 6의 얼리 액세스 런칭으로 Xbox 커뮤니티가 들썩이고 있다. 미국 기반 게이밍 매거진 Pure Xbox는 이번 주말(5월 16-17일)을 '특별한 주말'이라 표현하며, 일본을 배경으로 한 오픈월드 레이싱 게임에 대한 높은 기대감을 반영했다. Xbox Game Pass 구독자들은 추가 비용 없이 신작을 즉시 플레이할 수 있다는 점에서 이번 타이틀이 구독 서비스의 가치를 재입증하는 계기가 될 것으로 보인다.\n\n포르자 호라이즌 시리즈는 플레이그라운드 게임즈의 대표작으로, 전 세계 오픈월드 레이싱 게임 시장에서 가장 높은 평가를 받아온 프랜차이즈다. 이번 6편은 일본의 도시, 시골, 산악 지형을 배경으로 다양한 주행 환경을 제공하며, 차량 커스터마이징, 멀티플레이 이벤트, 동적 날씨 시스템 등이 강화된 것으로 알려져 있다. Xbox Series X|S의 고사양을 활용한 4K 고주사율(120fps) 구동이 가능할 것으로 예상되며, 레이 트레이싱 기술로 야간 운전 시 반사 표현이 대폭 개선될 것으로 기대된다.\n\n이번 얼리 액세스 런칭은 Xbox의 독점작 라인업 강화라는 맥락에서 매우 중요한 신호다. 마이크로소프트는 Game Pass를 통한 신작 동시 제공으로 구독자 확보 경쟁에서 경쟁사 대비 우위를 점해 왔으며, 포르자 호라이즌 6은 이러한 전략의 정점이라 할 수 있다. 특히 일본 배경이라는 소재 선택은 아시아태평양 지역, 특히 국내 유저층의 관심을 직접적으로 겨냥한 것으로 해석된다.\n\n포르자 호라이즌 6은 Xbox Series X|S 및 PC(Windows 11)에서 Game Pass 구독 시 추가 비용 없이 플레이 가능하다. 다만 국내 정식 한국어 지원은 아직 공식 확인 전 상태이며, 영문 인터페이스로 플레이할 수 있다. 얼리 액세스 종료 후 정식 출시 일정과 한국 내 가격 정보는 마이크로소프트 코리아의 추가 공지를 통해 확인 가능할 것으로 예상된다.	{"Xbox Series X|S","포르자 호라이즌 6","Game Pass","얼리 액세스"}	PUBLISHED	2026-05-19 11:04:33.625	2026-05-19 11:04:33.625	0
cmpcj07am002baa8ayi1ngwri	Beloved VR Game 'Moss' Is Finally Getting The Xbox Treatment In 2026	https://www.purexbox.com/news/2026/05/beloved-vr-game-moss-is-finally-getting-the-xbox-treatment-in-2026	2026-05-15 19:30:00	Pure Xbox	Console	Xbox	fixed	Xbox Series X|S, 8년 기다린 VR 명작 'Moss: The Forgotten Relic' 2026년 정식 출시	PlayStation VR과 PC VR을 휩쓸었던 인디 명작 'Moss' 프랜차이즈가 Xbox 플랫폼에 정식 진출한다. 두 편의 게임을 통합한 스탠드얼론 타이틀 'Moss: The Forgotten Relic'으로 2026년 출시될 예정이다.	VR 플랫폼에서 8년간 소니와 PC 진영을 지배했던 인디 판타지 어드벤처 'Moss' 시리즈가 마침내 Xbox 무대에 오른다. Polyarc Games는 최근 'Moss: The Forgotten Relic'이라는 통합 타이틀로 2026년 Xbox Series X와 Series S에 정식 출시할 것을 공식 발표했다. 이는 첫 번째 작품과 그 후속작 'Moss: Book 2'의 콘텐츠를 하나의 스탠드얼론 게임으로 재구성한 버전으로, Xbox 커뮤니티에는 사실상 신작 경험을 제공할 것으로 예상된다.\n\n플레이어는 작은 쥐 주인공 '퀼(Quill)'을 조종하며 탐험과 퍼즐 해결을 통해 '용기와 연결의 여정'을 경험하게 된다. 원문에서 강조된 'heartfelt journey of challenge, courage, and connection'이라는 게임의 핵심 테마는 인디 게임으로서의 서사적 깊이를 암시한다. Xbox Series X의 고성능 GPU와 SSD를 활용하면 원작의 정교한 3D 환경과 퍼즐 메커니즘이 기존 VR 버전보다 더욱 정교하게 구현될 수 있을 것으로 보인다.\n\n이번 Xbox 진출은 마이크로소프트가 인디 게임 생태계 확대에 주력하는 전략적 움직임을 반영한다. Game Pass 구독 서비스의 주요 콘텐츠 라인업 강화와 PlayStation 독점 이미지가 강한 소프트웨어 진영에 대한 경쟁 심화라는 맥락이 있다. 특히 VR 게임의 Xbox 플랫폼 이식 사례는 아직 드물어, 콘솔 시장의 VR 콘텐츠 다양화 신호탄으로도 해석된다.\n\n현재 국내 정식 출시 여부와 한국어 자막 지원은 확정되지 않았으나, Xbox 타이틀의 일반적 현지화 정책상 발매 시점 인근에 공식 공지가 있을 것으로 예상된다. 가격대는 미공개 상태이며, 2026년 출시 예정이므로 Game Pass 포함 여부도 추후 확인 필요하다. Xbox Series X|S 보유자는 공식 Microsoft Store 또는 Xbox 스토어를 통해 사전 정보 등록을 권장한다.	{"Xbox Series X|S","Moss: The Forgotten Relic","인디 게임","VR 게임 이식","2026년 출시"}	PUBLISHED	2026-05-19 11:04:44.783	2026-05-19 11:04:44.783	0
cmpcj20f7002iaa8a06bbjr11	Nintendo Alarmo Has Received A Small Update Today	https://www.nintendolife.com/news/2026/05/nintendo-alarmo-has-received-a-small-update-today	2026-05-19 04:05:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Alarmo, 신년 첫 펌웨어 업데이트(v4.0.0) 공개... 신규 기능 추가	닌텐도가 사운드 시계 'Alarmo'의 2026년 첫 정식 업데이트를 배포했으며, 신규 기능 추가와 안정성 개선을 담은 v4.0.0으로 업그레이드되었습니다.	닌텐도가 지난해 10월 패치 이후 약 3개월 만에 사운드 시계 제품 'Alarmo'의 신규 펌웨어 업데이트를 배포했습니다. v4.0.0으로 갱신된 이번 업데이트는 단순 버그 수정을 넘어 사용자 경험을 개선하기 위한 새로운 기능을 포함하고 있으며, 닌텐도의 일관된 정책인 시스템 안정성 강화 패치도 함께 적용되었습니다.\n\nAlarmò는 닌텐도가 2024년 중반 출시한 독자적인 하드웨어로, 단순 알람 기능을 넘어 닌텐도 IP 기반의 사운드와 게임 요소를 접목한 '라이프스타일 기기'입니다. 정기적인 펌웨어 업데이트 지원을 통해 닌텐도는 이 제품의 지속적인 가치 제공을 약속하고 있으며, 이는 Switch나 Switch Lite 같은 주력 게임 하드웨어와 동일한 수준의 사후 관리 체계를 의미합니다.\n\n이번 업데이트는 Alarmo가 단순 게라 주변기기가 아닌 '지속적 개선이 가능한 스마트 기기'로서 위상을 확립하려는 닌텐도의 전략을 반영합니다. 특히 Switch 2의 출시가 임박한 시점에서, 닌텐도가 기존 생태계 제품들의 지원을 강화하는 움직임은 사용자 충성도 유지와 관련 악세서리 시장 활성화 측면에서 긍정적 신호로 평가됩니다.\n\n국내에서는 Alarmo의 공식 정식 발매가 아직 이루어지지 않았으나, 일부 열성 유저들이 병렬수입으로 사용 중입니다. 해외 구매 시 유통가는 약 99,990원(USD $79.99 기준)으로, 한국어 인터페이스 지원 여부는 추가 확인이 필요합니다.	{Nintendo,"Nintendo Alarmo","펌웨어 업데이트","사운드 시계"}	PUBLISHED	2026-05-19 11:06:09.186	2026-05-19 11:06:09.186	0
cmpcj26vq002jaa8azbz9li1z	Rumour: LEGO's Next Big Pokémon Set Might Have Been Revealed	https://www.nintendolife.com/news/2026/05/rumour-legos-next-big-pokemon-set-might-have-been-revealed	2026-05-19 03:05:00	Nintendo Life	Console	Nintendo	fixed	레고 포켓몬 신작 유출, 1세대 아르카나인 피규어 내년 8월 출시 예정	레고 포켓몬 공식 협력 시리즈의 신규 제품으로 초대 포켓몬 아르카나인이 1,190피스 규모로 출시될 것으로 예상된다. 이는 포켓몬과 장난감 문화를 결합한 닌텐도의 IP 확장 전략의 일환으로 주목된다.	레고가 포켓몬 라이센스를 기반으로 출시하는 신규 빌딩 세트에 1세대 포켓몬인 아르카나인이 포함될 것으로 알려졌다. 아마존 등 다수의 온라인 스토어에서 지난주 유출된 박스 아트 이미지에 따르면, 해당 제품은 1,190개의 조립 블록으로 구성될 예정이다.\n\n공개된 정보에 따르면 미국 기준 정가는 $109.99(약 15만 원대로 추정)이며, 2026년 8월 정식 출시를 목표하고 있다. 레고 포켓몬 시리즈는 지난해 공식 발표 이후 점진적으로 라인업을 확대하고 있으며, 이번 아르카나인 세트는 대규모 빌딩 세트 카테고리에서 중간 정도의 가격대를 형성할 것으로 보인다.\n\n이같은 움직임은 닌텐도의 포켓몬 프랜차이즈를 게임 플랫폼을 넘어 피지컬 상품으로 확대하려는 전략의 연장선이다. 특히 1세대 포켓몬인 아르카나인을 선택한 것은 글로벌 팬층이 두터운 오리지널 도감의 인기도를 활용하면서, 닌텐도 Switch 이용층(특히 성인 게이머와 수집가)을 겨냥한 의도로 읽힌다.\n\n국내 정식 발매 일정 및 가격은 아직 공식 발표되지 않았으나, 레고 코리아의 포켓몬 라인업이 국내에서도 점진적으로 확대되고 있는 추세이다. 한글 구성 설명서 제공 여부와 국내 정가는 2026년 상반기 공식 발표 시 확인될 예정이다.	{Nintendo,포켓몬,"레고 협력",글로벌뉴스,"IP 확장"}	PUBLISHED	2026-05-19 11:06:17.559	2026-05-19 11:06:17.559	0
cmpcj2dzo002kaa8a7lb6lgwa	Street Fighter 6's Next Update Is Adding New Avatar Game Modes	https://www.nintendolife.com/news/2026/05/street-fighter-6s-next-update-is-adding-new-avatar-game-modes	2026-05-19 02:05:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch, 스트리트파이터 6 신규 아바타 모드 추가... 신DLC 캐릭터 잉그리드와 동시 출시	캡콤이 스트리트파이터 6의 차기 업데이트에서 아바타 랜덤 매치와 아바타 아케이드 모드를 신규 추가하며, 유료 DLC 캐릭터 잉그리드와 함께 5월 28일 배포될 예정이다.	캡콤이 Nintendo Switch용 스트리트파이터 6의 확장 콘텐츠 로드맵을 한 단계 진전시켰다. 차기 DLC 파이터인 잉그리드(Ingrid) 출시에 앞서 공식 발표한 신규 아바타 전용 게임 모드들은 기존 아바타 시스템을 활용한 싱글플레이 및 온라인 매칭 경험을 크게 확대하는 콘텐츠로 평가받고 있다.\n\n신규 추가되는 '아바타 랜덤 매치'와 '아바타 아케이드 모드'는 각각 온라인 매칭에서 자신의 커스텀 아바타 캐릭터로 플레이하는 경험과 싱글플레이 중심의 아케이드 스토리를 아바타로 진행할 수 있는 기능을 제공한다. 이는 기존 스토리 모드나 일반 vs 모드에 비해 개인화된 게임 경험을 원하는 유저들의 니즈를 충족시키는 방식으로, 장시간 플레이 콘텐츠 부족을 보완하려는 캡콤의 전략으로 해석된다.\n\n이번 업데이트는 Nintendo Switch를 포함한 멀티 플랫폼 동시 배포 정책을 유지하면서도, 스위치의 휴대성을 활용한 캐주얼 격투게임 경험 확대에 방점을 두고 있다. 특히 DLC 캐릭터 잉그리드와의 동시 출시는 유료 DLC 구매자들에게 추가 가치를 제공하는 동시에, 기존 사용자들도 무료로 모드 시스템 자체를 업그레이드받도록 한 점이 업계의 선례로 평가받는 중이다.\n\n**국내 유저 가이드** | 스트리트파이터 6는 Nintendo Switch, PS5, Xbox Series X|S에서 정식 발매 중이며, 국내 기준 정가는 약 59,800원대이다. 한국어 자막을 완벽 지원하고 있으며, 신규 아바타 모드는 5월 28일 글로벌 동시 배포될 예정이다. DLC 캐릭터 잉그리드의 추가 가격은 약 6,600원대로 확인되고 있다.	{"Nintendo Switch","스트리트파이터 6",DLC,"게임 모드",캡콤}	PUBLISHED	2026-05-19 11:06:26.771	2026-05-19 11:06:26.771	0
cmpcj2lqb002laa8abfhdrm08	The Adventures Of Elliot: The Millennium Tales New 'Prologue Demo' Released	https://www.nintendolife.com/news/2026/05/the-adventures-of-elliot-the-millennium-tales-new-prologue-demo-released	2026-05-19 01:05:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch 2, '엘리엇의 모험: 밀레니엄 테일즈' 프롤로그 데모 공개... 세이브 데이터 완전 호환	스퀘어 에닉스가 차기작 '엘리엇의 모험: 밀레니엄 테일즈'의 프롤로그 데모를 Nintendo Switch 2 등 멀티 플랫폼에 공개했으며, 데모에서의 세이브 데이터가 정식 출시 버전으로 완전 이전 가능한 것으로 확인됐다.	스퀨어 에닉스는 Nintendo Switch 2 출시를 앞두고 예정작 '엘리엇의 모험: 밀레니엄 테일즈'의 프롤로그 데모를 공개했다. 이번 데모 공개는 지난 프리뷰 라운드에 이어진 추가 프로모션으로, 플레이어들이 정식 출시 전 게임의 개방적 모험 시스템을 직접 체험할 수 있는 기회를 제공한다.\n\n프롤로그 데모는 게임의 오프닝 챕터에 해당하는 내용을 담고 있으며, 정식 버전에서 제공되는 "동일한 자유도의 모험 경험"을 미리 경험할 수 있다. 특히 주목할 점은 데모에서 생성된 세이브 파일이 정식 출시 버전으로 완전히 호환된다는 것으로, 플레이어들이 프롤로그에서의 진행 상황을 그대로 유지한 채 본편을 이어 진행할 수 있다. 이러한 세이브 데이터 호환 시스템은 Nintendo Switch 2 초기 라인업 게임들에서 증가하는 추세로, 플레이어의 진입 장벽을 낮추는 전략으로 평가받는다.\n\n이번 프롤로그 데모 공개는 Nintendo Switch 2의 성공적인 론칭 시즌을 조성하기 위한 스퀘어 에닉스의 전략적 결정으로 보인다. 프롤로그 체험을 통해 플레이어들의 게임 만족도를 조기에 검증하고, 정식 출시 버전에 대한 구매 의향을 높이려는 의도로 읽힌다. 특히 개방형 월드 게임의 특성상 사전 체험 기회가 구매 결정에 미치는 영향이 크다는 점에서, 이 전략은 국내 Nintendo 유저들 사이에서도 긍정적 반응을 유도할 것으로 예상된다.\n\n프롤로그 데모는 Nintendo Switch 2를 비롯한 멀티 플랫폼(PS5, Xbox Series X|S 등)에서 무료로 제공되며, 정식 출시는 내달 예정이다. 국내 한국어 자막 지원 여부와 정식 발매 가격(예상 6만 원대)은 스퀘어 에닉스의 추가 공식 발표를 통해 확인될 예정이다. Nintendo Switch 온라인 구독자는 Nintendo eShop에서, 비구독자는 각 플랫폼의 디지털 스토어에서 프롤로그 데모를 다운로드할 수 있다.	{"Nintendo Switch 2","엘리엇의 모험: 밀레니엄 테일즈","프롤로그 데모","스퀘어 에닉스","세이브 데이터 호환",멀티플랫폼}	PUBLISHED	2026-05-19 11:06:36.803	2026-05-19 11:06:36.803	0
cmpcj2th6002maa8alb3230ez	Surprise! Nintendo Has Announced A New Mobile Game	https://www.nintendolife.com/news/2026/05/surprise-nintendo-has-announced-a-new-mobile-game	2026-05-19 00:05:00	Nintendo Life	Console	Nintendo	fixed	Nintendo, 사진 기반 미니게임 '픽토니코!' 모바일 출시 예고... 인텔리젼트 시스템과 협력	닌텐도가 자사 사진을 미니게임으로 변환하는 프리투스타트 모바일 게임 '픽토니코!'를 5월 28일 출시 예정. 와리오웨어, 파이어 엠블럼 등을 개발한 인텔리젼트 시스템과 공동 개발.	닌텐도가 모바일 게임 시장에 새로운 시도를 가하고 있다. 공식 발표에 따르면 다음 주 5월 28일 '픽토니코!(Pictonico!)'라는 프리투스타트 타입의 모바일 게임을 출시할 예정이다. 이는 닌텐도의 자체 개발사인 인텔리젼트 시스템이 주도한 프로젝트로, 와리오웨어 시리즈의 경쾌한 게임성을 모바일 플랫폼으로 재해석한 작품으로 보인다.\n\n픽토니코의 핵심 콘셉트는 스마트폰에 저장된 사용자의 사진을 80여 개의 서로 다른 미니게임으로 변환하는 기능이다. 단순히 사진을 게임 배경으로 활용하는 차원을 넘어, 촬영한 이미지의 색상, 구도, 피사체 특성을 인식해 각각 맞춤형 미니게임을 생성하는 방식으로 추정된다. 이는 스마트폰이 보유한 카메라 센서와 프로세싱 성능을 적극 활용한 혁신적 게임디자인 철학을 반영한다.\n\n이번 발표는 닌텐도의 모바일 전략 변화를 시사한다. 그간 닌텐도는 슈퍼마리오 런, 파이어 엠블럼: 히어로즈 등 기존 IP를 모바일로 포팅하는 데 집중했으나, 픽토니코는 모바일 고유의 하드웨어 특성(카메라, 센서)을 활용한 원천적 신규 콘텐츠 개발로 방향을 전환했다는 의미다. 또한 프리투스타트 모델은 진입장벽을 낮춰 글로벌 모바일 유저층의 접근성을 극대화하려는 전략으로 해석된다.\n\n**국내 유저 가이드**: 현재까지 한국어 지원 여부는 공식 발표되지 않았으나, 닌텐도의 기존 모바일 타이틀들이 다언어 지원을 기본으로 하는 점을 감안하면 한국 앱마켓(Google Play, App Store) 출시 시 한글화될 가능성이 높다. 프리투스타트 타입으로 기본 다운로드는 무료이며, 게임 내 결제를 통한 추가 콘텐츠 확장이 예상된다. 5월 28일 iOS 및 Android 동시 출시 예정.	{Nintendo,모바일게임,Pictonico,픽토니코,프리투스타트,인텔리젼트시스템,미니게임}	PUBLISHED	2026-05-19 11:06:46.841	2026-05-19 11:06:46.841	0
cmpcj38ve002oaa8asw2wxtb8	"That's Amazing!" - Final Fantasy Creator Approves Of FF6 Video Created By AI	https://www.nintendolife.com/news/2026/05/thats-amazing-final-fantasy-creator-approves-of-ff6-video-created-by-ai	2026-05-18 17:00:00	Nintendo Life	Console	Nintendo	fixed	최종환상 크리에이터 사쿠라기, AI 생성 FF6 리메이크 영상에 '놀라워'... 게임업계 AI 활용 논란 재점화	최종환상 시리즈의 창시자 히로노부 사쿠라기가 AI 생성 영상으로 만든 FF6 리메이크 콘셉트에 긍정적 반응을 보이면서, 게임 업계의 AI 활용을 둘러싼 윤리 논쟁이 다시금 수면 위로 올라왔다.	최종환상 시리즈의 설계자 히로노부 사쿠라기가 X(구 트위터)에서 생성형 AI로 제작된 FF6 리메이크 영상에 호의적인 평가를 남기면서 게임 업계 내 AI 생성물에 대한 태도 문제가 다시 불거졌다. 사쿠라기는 해당 영상을 보고 "That's Amazing!"이라는 짧은 댓글을 남겼으며, 이는 전설적 게임 크리에이터의 공식 입장으로 해석되면서 국내 게임 커뮤니티에서도 논란의 대상이 되고 있다.\n\nAI 생성 영상에 대한 게임 업계의 입장은 여전히 엇갈린 상태다. 일부 크리에이터와 스튜디오들은 프로토타이핑이나 콘셉트 검증 단계에서 생성형 AI의 효율성을 인정하고 있지만, 동시에 예술적 창작성을 훼손할 수 있다는 우려도 이어지고 있다. 사쿠라기의 발언은 게임 업계의 거장조차 AI 기술의 비주얼 표현력에 주목하고 있다는 점에서 향후 리메이크, 리마스터 프로젝트의 개발 방식 변화를 예고할 가능성이 있다.\n\nFF6는 1994년 Super Famicom(국내명: 슈퍼패미컴)으로 출시된 역사적 명작으로, Nintendo Switch 플랫폼에서도 2006년 발매된 GBA 리메이크 버전을 플레이할 수 있다. 현재 스퀘어에닉스는 공식적인 FF6 풀 리메이크 프로젝트를 발표하지 않았으며, 사쿠라기의 발언도 팬 제작 콘셉트에 대한 개인적 감상일 가능성이 높다. 다만 이번 사건을 통해 AAA 게임 개발 현장에서도 생성형 AI의 역할에 대한 정책 수립이 시급해 보인다.	{"Nintendo Switch","Final Fantasy VI","AI 생성 콘텐츠","게임 개발 트렌드"}	PUBLISHED	2026-05-19 11:07:06.794	2026-05-19 11:07:06.794	0
cmpcj3i40002paa8ata6pbse6	Marvel Cosmic Invasion DLC Adds Two New Fighters Today	https://www.nintendolife.com/news/2026/05/marvel-cosmic-invasion-dlc-adds-two-new-fighters-today	2026-05-18 16:30:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch, 'Marvel Cosmic Invasion' 신규 DLC 공개... 사이클롭스·더 씽 추가	도테무와 트리뷰트 게임즈가 Nintendo Switch 독점 비트 액션 게임 '마블 코즈믹 인베이전'에 신규 파이터 2명을 추가하는 유료 DLC를 출시했다. 가격은 $3.99(약 5,200원).	Nintendo Switch용 2D 비트 액션 게임 '마블 코즈믹 인베이전'에 새로운 플레이어블 캐릭터 DLC가 공개됐다. 도테무와 트리뷰트 게임즈가 공식 발표한 이번 신규 콘텐츠는 마블 유니버스의 인기 캐릭터인 사이클롭스(스콧 서머스)와 더 씽(벤 그림)을 게임에 추가한다. 양쪽 캐릭터 모두 고유한 콤보 무브셋과 보이스 라인을 갖춘 완전한 파이터로 구현됐다.\n\n이번 DLC 추가로 게임의 선택 가능한 캐릭터 풀이 더욱 확장되며, 각 캐릭터의 개별 플레이스타일이 독립적으로 설계돼 게임의 반복성과 재미 지수가 높아질 것으로 예상된다. 사이클롭스는 레이저 기반의 원거리 공격에 특화될 것으로 보이며, 더 씽은 높은 파워와 방어력을 갖춘 헤비 파이터로 포지셔닝될 가능성이 높다. DLC 용량 및 세부 기술 사양은 아직 공개되지 않았지만, Nintendo Switch의 스토리지 용량(64GB 기본 저장공간)을 고려할 때 부담 없는 수준의 다운로드 크기로 예상된다.\n\n도테무와 트리뷰트 게임즈의 지속적인 DLC 로드맵은 Nintendo Switch 독점 타이틀로서의 가치를 강화하려는 전략이다. 마블 IP를 활용한 비트 액션 게임의 초기 성공에 기반해, 단순 스킨 추가를 넘어 완전한 신규 캐릭터를 추가함으로써 플레이어의 참여 유도를 지속하는 모습이다. 이는 Nintendo Switch 사용자층의 인디 및 중소 규모 게임에 대한 꾸준한 관심을 반영한 것으로, 구독 서비스(Nintendo Switch Online)와는 별개로 추가 유료 콘텐츠 판매로 매출을 창출하는 구조로 작동한다.\n\n**[국내 유저 가이드]**\n- 출시 플랫폼: Nintendo Switch(독점)\n- DLC 가격: $3.99(약 5,200원, 현지화율 기준)\n- 한국어 지원: 미확인(공식 한국어 로컬라이제이션 여부는 제작사 공지 대기)\n- 구매 경로: Nintendo eShop\n- 선행 구매 요건: 본편 '마블 코즈믹 인베이전' 필수 소유\n- 출시 일정: 즉시 공개(서프라이즈 드롭)	{"Nintendo Switch","Marvel Cosmic Invasion","DLC/신규 캐릭터","비트 액션","인디 게임"}	PUBLISHED	2026-05-19 11:07:18.768	2026-05-19 11:07:18.768	0
cmpcj3roi002qaa8ahvmhxpsu	Review: Coffee Talk Tokyo (Switch) - An Enjoyable, Bittersweet Third Blend	https://www.nintendolife.com/reviews/switch-eshop/coffee-talk-tokyo	2026-05-18 16:00:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch, 감성 카페 시뮬레이션 '커피토크 도쿄' 리뷰 - 따뜻하면서도 쓸쓸한 세 번째 블렌드	Nintendo Switch 독점작 '커피토크 도쿄'는 바리스타 일상을 배경으로 한 감성 어드벤처 게임으로, 전작의 매력을 이어가면서도 새로운 무드를 더한 수작으로 평가받고 있다.	Nintendo Switch 플랫폼에서 감성 있는 일상 시뮬레이션을 찾는 유저들에게 반가운 소식이다. '커피토크 도쿄'는 뉴욕의 바쁜 카페 환경에서 시작된 시리즈의 정통성을 유지하면서도, 도쿄라는 새로운 배경과 독특한 이야기 구조로 플레이어들의 감정에 촘촘하게 다가선다. 리뷰어의 실제 바리스타 경험담이 녹아든 이 게임은 단순한 음료 제조 시뮬레이션을 넘어, 인물 간의 관계와 일상의 소소한 순간들을 주제로 다루는 스토리 기반 게임으로 자리매김했다.\n\n게임의 핵심은 고객 맞춤형 음료를 만드는 과정 자체보다는, 각 손님과의 대화를 통해 벌어지는 인간관계의 변화에 있다. Switch의 휴대성을 최대한 활용하여 출퇴근길이나 짧은 휴식 시간에 적합한 플레이 타임(스토리당 약 2~3시간)을 제공하며, 터치스크린 조작을 활용한 직관적인 인터페이스가 게임의 진입장벽을 낮췄다. 그래픽은 픽셀 아트 스타일로 일관되어 있어 Switch 구성의 성능 한계를 정교하게 보완했으며, 게임 전반에 걸친 안정적인 60프레임 구동으로 스트레스 없는 플레이 경험을 보장한다.\n\n시리즈의 세 번째 작품이라는 점에서 프랜차이즈 피로도가 우려되었지만, '도쿄'라는 새 무대와 그곳의 독특한 카페 문화, 그리고 일본 특유의 감정 표현 방식이 신선함을 더했다. Nintendo eShop 독점 출시로 인한 접근성 강화는 인디 게임 애호가와 감성 게임 팬층 모두에게 긍정적으로 작용했다. 특히 Nintendo Switch Online 구독자 혜택(구독 게임 포함 가능성)과의 연계 전략이 추진된다면, 플랫폼 생태계 강화에도 기여할 수 있는 작품으로 평가받고 있다.\n\n**국내 출시 정보**: '커피토크 도쿄'는 Nintendo eShop을 통해 정식 한국어 자막 지원으로 이용 가능하며, 정가는 약 14,900원(원화 기준)이다. Nintendo Switch 모든 기종(스탠다드, OLED, Lite)에서 플레이 가능하며, 게임 용량은 약 350MB로 용량 부족 문제는 없다. 한국 내 출시일은 글로벌 동시 출시 기준이 적용되었으며, eShop에서 바로 다운로드 구매 형태로만 제공된다.	{"Nintendo Switch","커피토크 도쿄","감성 어드벤처","인디 게임","한국어 지원"}	PUBLISHED	2026-05-19 11:07:31.169	2026-05-19 11:07:31.169	0
cmpcj3zih002raa8a6wcuyone	It's Official, Nintendo Is Heading To Gamescom This Year	https://www.nintendolife.com/news/2026/05/its-official-nintendo-is-heading-to-gamescom-this-year	2026-05-18 15:15:00	Nintendo Life	Console	Nintendo	fixed	Nintendo, Gamescom 2026 공식 참가 확정... 8월 쾰른서 대규모 전시 준비	닌텐도가 8월 26~30일 독일 쾰른에서 열리는 게임스컴 2026에 공식 참가를 발표했으며, 작년 대성공에 이어 올해도 대규모 플로어 존을 구성할 것으로 예상된다.	닌텐도가 2026년 게임스컴(Gamescom) 참가를 공식 확정했다. 닌텐도 독일 공식 X 계정을 통해 8월 26~30일 독일 쾰른에서 개최되는 게임스컴 행사 전 기간에 참전할 것을 명시했다. 이는 지난해 게임스컴에서 업계 최고 수준의 전시 부스로 호평받은 닌텐도가 올해도 유럽 게이머들을 대상으로 대규모 마케팅을 펼칠 준비를 하고 있음을 의미한다.\n\n현재까지 닌텐도가 게임스컴 2026에서 공개할 타이틀이나 세부 일정은 공개되지 않았다. 다만 게임스컴은 gamescom.global에 따르면 유럽 최대 규모의 게임 쇼케이스로, 연간 30만 명이 넘는 입장객이 참석하는 만큼 닌텐도의 신작 게임 발표 무대로 활용될 가능성이 높다. 일반적으로 주요 퍼블리셔들은 게임스컴 개최 수주 전부터 참전 라인업을 공개하는 패턴을 따르고 있어, 향후 수개월 내 닌텐도의 공식 공지가 이어질 것으로 전망된다.\n\n닌텐도의 게임스컴 참가 확정은 유럽 시장 내 Nintendo Switch의 입지를 강화하려는 전략으로 해석된다. 게임스컴은 유럽 게이머들이 최신 게임을 체험하는 가장 큰 창구이며, 작년 닌텐도의 호평받은 전시는 올해 신작 발표에 대한 관심을 더욱 증폭시킬 수 있다. 특히 Nintendo Switch의 후속 기종 출시 가능성이 논의되는 시점에서, 게임스컴은 새로운 하드웨어나 주요 독점작을 유럽 시장에 소개하는 최적의 기회가 될 것으로 보인다.\n\n게임스컴 2026은 8월 26~30일(현지 시간) 독일 쾰른에서 개최되며, 일반인 입장은 28~30일에 가능하다. 국내 팬들은 현지 생중계나 공식 뉴스를 통해 닌텐도의 참전 라인업을 확인할 수 있으며, 해당 게임들의 한국 정식 발매 시기와 한글 지원 여부는 향후 공식 발표를 기다려야 한다.	{Nintendo,"게임스컴 2026","유럽 마케팅","Nintendo Switch","글로벌 게임쇼"}	PUBLISHED	2026-05-19 11:07:41.322	2026-05-19 11:07:41.322	0
cmpcj46s5002saa8as936zwr8	Using GameChat Will Actually Boost Pragmata's Performance On Switch 2	https://www.nintendolife.com/news/2026/05/using-gamechat-will-actually-boost-pragmatas-performance-on-switch-2	2026-05-18 14:45:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch 2, 게임챗 활용으로 '프라그마타' 프레임 성능 향상 가능... 디지털 파운드리 실측	카프콤의 'Pragmata'를 Switch 2에서 플레이할 때 게임챗 기능을 활성화하면 화면 해상도 축소로 인한 GPU 부하 감소로 프레임 향상을 경험할 수 있는 것으로 확인됐다.	Nintendo Switch 2의 성능을 최대한 끌어내는 방식이 의외의 곳에서 발견됐다. 카프콤의 'Pragmata'를 플레이하는 도중 게임챗 기능을 사용하면 화면이 축소되면서 GPU 부하가 경감돼, 평소보다 더 높은 프레임률을 유지할 수 있다는 점이 기술 분석 채널 Digital Foundry의 실측을 통해 드러났다. 이는 Switch 2의 휴대 모드에서 음성 채팅을 활용할 때의 예상치 못한 성능 최적화 사례다.\n\n구체적인 성능 수치를 보면, 게임챗을 미사용할 때 'Pragmata'의 프레임 유지율은 상황에 따라 47~53fps 대역에서 변동한다. 하지만 게임챗을 활성화해 화면 해상도를 축소하면 이보다 상단의 프레임 범위를 안정적으로 확보할 수 있게 된다. 이는 Switch 2의 GPU 리소스가 고해상도 렌더링에서 해제되면서 프레임 생성에 더 많은 연산 능력을 할당할 수 있기 때문이다.\n\n이 현상은 Switch 2의 하이브리드 아키텍처와 게임챗의 화면 축소 로직이 우연히 맞아떨어진 경우로, 개발사 의도는 아닐 가능성이 높다. 다만 이는 Nintendo의 차기 플랫폼이 도킹/휴대 모드 간 유연한 성능 조절 설계를 갖춘 점을 반증하며, 향후 Switch 2 타이틀 최적화에 있어 해상도와 프레임 타겟의 균형을 어떻게 잡을지에 대한 개발사들의 고민을 시사한다.\n\n'Pragmata'는 현재 Nintendo Switch 2를 포함한 주요 플랫폼에서 정식 발매된 상태다. Switch 2 버전은 한국어 자막을 지원하며, 정가는 약 59,900원대로 책정돼 있다. 게임챗 기능을 활용한 성능 향상 팁은 별도의 패치 없이 현재 빌드에서 즉시 적용 가능하다.	{"Nintendo Switch 2",Pragmata,"성능 최적화",게임챗}	PUBLISHED	2026-05-19 11:07:50.74	2026-05-19 11:07:50.74	0
cmpcj4gcw002taa8a43etg9jr	Hands On: The Classic Zelda Formula Is In Safe Hands With 'The Adventures Of Elliot'	https://www.nintendolife.com/previews/hands-on-the-classic-zelda-formula-is-in-safe-hands-with-the-adventures-of-elliot	2026-05-18 14:00:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch, 젤다의 전설 클래식 공식 주제곡 해석한 인디 신작 '엘리엇의 모험'이 화제	스퀘어 에닉스의 신작 '엘리엇의 모험: 밀레니엄 테일즈'가 2013년 이후 단절된 '클래식 젤다' 포맷을 성공적으로 구현해 국내 어드벤처 팬들의 이목을 집중시키고 있습니다.	젤다의 전설 시리즈의 정체성이 크게 변화한 가운데, 팬들이 그리워하던 '클래식 2D 톱다운 뷰' 방식의 게임이 인디 영역에서 부활했습니다. 니텐도는 '브레스 오브 더 와일드' 이후 오픈월드 기반의 대규모 혁신에 집중한 반면, 스퀘어 에닉스의 새로운 타이틀 '엘리엇의 모험: 밀레니엄 테일즈'는 2013년 '신 용사의 날개'부터 단절된, 던전 클리어→현인 수집→명확한 퍼즐 솔루션이라는 전형적인 젤다 공식으로 돌아왔습니다.\n\n본 타이틀은 슈퍼 패미컴 시대 '신 젤다의 전설'의 비주얼과 게임 플로우를 현대적으로 해석한 구성으로 평가받고 있습니다. 명확한 목표 구조, 직관적인 던전 설계, 아이템 기반 전개 같은 클래식 요소들이 현재의 인디 게임 트렌드와 결합되어, 공식 신작을 기다리는 팬층에게 실질적인 대체재 역할을 하고 있습니다. 특히 Switch의 휴대 모드에서 플레이할 때의 콤팩트한 게임성이 하드웨어의 장점과 완벽히 매칭되는 점이 강점으로 지적됩니다.\n\n이는 닌텐도가 대형 퍼스트파티 타이틀에 자원을 집중하면서 간과한 니즈를 인디 개발사가 채우는 현상을 보여줍니다. 젤다 신작이 '티어스 오브 더 킹덤' 이후 장시간 공백을 보이는 상황에서, 클래식 포맷을 정통으로 계승한 타이제목이 커뮤니티의 호평을 얻는 것은 향후 닌텐도의 프랜차이즈 전략에도 영향을 줄 수 있는 신호입니다.\n\n현재 '엘리엇의 모험: 밀레니엄 테일즈'의 한국 정식 출시 정보는 공식 발표되지 않았으며, Nintendo eShop 해외 스토어를 통한 수입 구매가 유력합니다. 한국어 자막 지원 여부는 개발사 공식 확인이 필요하며, 유럽 및 북미 지역의 출시 가격은 약 2만 원대(USD 24.99)로 예상됩니다. Switch 플랫폼 단독 출시로 알려져 있습니다.	{"Nintendo Switch","엘리엇의 모험: 밀레니엄 테일즈","젤다의 전설",인디게임,어드벤처}	PUBLISHED	2026-05-19 11:08:03.152	2026-05-19 11:08:03.152	0
cmpcj4oka002uaa8auxx306nn	Rumour: Watch Out PS2, Switch May Soon Get A Big Boost In India	https://www.nintendolife.com/news/2026/05/rumour-watch-out-ps2-switch-may-soon-get-a-big-boost-in-india	2026-05-18 10:00:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch, 인도 시장 진출 임박... PS2 역사적 판매량 넘을 가능성 대두	Nintendo가 인도 시장 공략을 준비 중인 것으로 알려지면서, Switch가 PS2의 1억 6천만 대 판매량 기록을 넘을 수 있는 전환점이 될 것으로 예상된다.	Nintendo의 최근 재무 공시 자료에서 인도 시장 진출 가능성이 시사되면서, 게임 업계의 이목이 집중되고 있다. 현재 Switch는 전 세계 1억 5천만 대에 가까운 누적 판매량으로 PlayStation 2(PS2)의 역대 최고 판매량 기록인 1억 6천만 대와의 격차를 좁혀가고 있는 상황이다. 인도는 세계에서 두 번째로 큰 인구를 보유한 시장으로, 모바일 게임 시장은 급성장 중이지만 정식 게임 콘솔 보급률은 여전히 낮은 편이다.\n\nIndia 진출은 Nintendo의 전략적 판단으로 볼 수 있다. 인도 게이머들의 구매력이 지속적으로 증가하고 있으며, Switch의 휴대성과 합리적인 가격대는 신흥 시장 공략에 최적화된 요소들이다. Nintendo는 지역별 가격 최적화(대다수 신흥국 버전에서는 현지화된 저가 정책 적용)와 현지화된 타이틀 포트폴리오 구성으로 인도 시장 진출을 추진할 것으로 예상된다. Switch 2의 서방 가격 인상 뉴스에 묻혀있었지만, 이번 인도 진출 시사는 Nintendo의 글로벌 확장 전략의 핵심을 보여주는 신호다.\n\n이는 Nintendo의 생명 연장 마케팅으로 해석된다. Switch 2 출시를 앞둔 시점에서도 초대 Switch의 신규 시장 공략을 전개하는 것은 두 기기의 공존 전략을 시사한다. PS2는 약 13년에 걸쳐 1억 6천만 대를 판매했으며, Switch가 이를 넘으려면 상당한 추가 판매량이 필요하다. 인도 시장이 아시아-태평양 지역의 게임 산업 중심으로 부상하는 가운데, 이 지역에서의 Switch 성과는 Nintendo의 차기 회계 연도 전망을 크게 좌우할 가능성이 높다.\n\n**국내 유저 안내 사항**: 현재 Nintendo Switch는 국내 정식 발매가 4만 9천 원대이며, 한국어 자막을 지원하는 타이틀이 점차 확대되고 있다. 인도 진출 시점에 대해 Nintendo가 공식 발표하지 않았으며, 추가 정보는 Nintendo 공식 채널을 통해 확인할 수 있다.	{"Nintendo Switch","시장 진출","인도 시장","판매량 기록","글로벌 전략"}	PUBLISHED	2026-05-19 11:08:13.785	2026-05-19 11:08:13.785	0
cmpcj4we8002vaa8a35tu6d7w	Namco's Caught The Suika Game Fever In This Upcoming Puzzler	https://www.nintendolife.com/news/2026/05/namcos-caught-the-suika-game-fever-in-this-upcoming-puzzler	2026-05-18 09:30:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch, 반남코의 '수이카 게임' 변형작 'Namco Legendary Mountains' 공개... 팩맨·디그더그 IP 접목	반남코가 글로벌 퍼즐 게임 열풍을 일으킨 '수이카 게임' 메커니즘을 차용해 자사 클래식 IP(팩맨, 디그더그 등)를 결합한 신작 'Namco Legendary Mountains'를 Switch 및 Switch 2용으로 개발 중임을 공식 발표했다.	2021년 출시 이후 글로벌 모바일 게임 시장을 휩쓴 '수이카 게임'의 열풍이 콘솔 시장까지 확산되고 있다. 반남코 산하 개발사 BeXide가 이 인기 퍼즐 메커니즘에 반남코의 상징적 캐릭터들을 접목한 'Namco Legendary Mountains'를 Nintendo Switch와 차세대 Switch 2용으로 준비 중임을 공식 발표한 것이다. 이는 단순한 장르 모방을 넘어 기존 IP의 신선한 재해석이라는 점에서 주목할 만하다.\n\n'Namco Legendary Mountains'는 수이카 게임의 핵심 메커니즘인 '같은 캐릭터 두 개를 매칭해 더 큰 캐릭터로 진화'하는 구조를 유지하되, 팩맨, 디그더그 등 반남코의 1980년대 아케이드 클래식 IP들을 진화의 대상으로 설정했다. 기존 수이카 게임의 익숙한 게임플레이 루프에 향수와 수집 요소를 결합함으로써, 클래식 게이머와 캐주얼 유저 모두를 공략하는 전략으로 해석된다.\n\n이 같은 움직임은 반남코뿐만 아니라 글로벌 게임 퍼블리셔들이 '수이카 게임'의 성공 공식을 다양한 IP와 플랫폼으로 확산시키려는 대리인 현상을 반영한다. Nintendo Switch의 캐주얼 게이머 기반과 Switch 2의 향상된 하드웨어 성능을 동시에 겨냥한 크로스 플랫폼 전략은, 반남코가 차세대 콘솔 세대를 대비하면서도 기존 사용자층을 잃지 않으려는 신중한 포지셔닝으로 평가된다.\n\n현재 정식 출시 일정, 가격대, 한국어 지원 여부는 아직 공개되지 않았다. Nintendo Korea를 통한 정식 발매 여부 및 한국어 자막 지원은 추후 반남코의 공식 발표를 기다려야 하며, Nintendo Switch eShop 및 소매점 사전 예약 정보는 추가 공지 시 국내 게이머들에게 안내될 예정이다.	{"Nintendo Switch","Nintendo Switch 2","Namco Legendary Mountains","퍼즐 게임","수이카 게임","IP 활용","캐주얼 게임"}	PUBLISHED	2026-05-19 11:08:23.937	2026-05-19 11:08:23.937	0
cmpcj54g0002waa8ab5ojfjzw	UK Charts: Indiana Jones Commences His Great Circular Crusade On Switch 2	https://www.nintendolife.com/news/2026/05/uk-charts-indiana-jones-commences-his-great-circular-crusade-on-switch-2	2026-05-18 07:15:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch 2, '인디아나 존스: 더 그레이트 서클' 출시 첫주 UK 차트 2위 진입... 플랫폼별 판매 99% 독점	인디아나 존스 프랜차이즈의 최신작이 Switch 2 독점으로 UK 시장에 상륙해 첫주 차트 2위에 올랐으며, 플랫폼 점유율 99%로 압도적 수치를 기록했다.	'인디아나 존스: 더 그레이트 서클'이 Switch 2 전용으로 영국 시장에 정식 출시돼 첫주 차트 진입에 성공했다. 메타크리틱 통합 순위에서 2위를 차지한 이 타이틀은 플랫폼 점유율 분석에서 Switch 2가 전체 판매량의 99%를 차지하며 절대적 지배력을 드러냈다. PS5와 Xbox 버전은 각각 1% 미만의 미미한 판매율을 기록했으며, 이는 닌텐도 신형 기기의 독점 유통 전략이 얼마나 효과적인지를 보여주는 사례다.\n\n'인디아나 존스: 더 그레이트 서클'은 루카스필름 게임스(LucasArts)의 IP를 활용한 어드벤처 타이틀로, Switch 2의 향상된 그래픽 처리 성능과 휴대성을 결합한 게임으로 평가받고 있다. 아직 영국 차트에서 '토모다찌 라이프'에 밀려 2위를 기록했지만, 신규 IP의 초기 진입 성적으로는 상당히 강력한 흐름을 보이고 있다. Switch 2의 초기 라인업 강화라는 전략 아래, 대작 타이틀들의 독점 공급이 가속화될 것으로 예상된다.\n\n이번 결과는 닌텐도의 Switch 2 독점 전략의 실효성을 입증하는 동시에, 멀티플랫폼 출시 시대의 변곡점을 시사한다. PS5와 Xbox가 여전히 그래픽과 성능 우위를 내세우고 있지만, 휴대형 하이브리드 장치로서의 Switch 2의 포지셔닝은 '어디서든 플레이 가능한 대작 경험'이라는 차별화 요소로 기능하고 있다. 업계 전문가들은 이러한 추세가 향후 2~3년간 독점 콘텐츠 확보 경쟁을 더욱 심화시킬 것으로 분석하고 있다.\n\n현재까지 한국 시장에서의 'Great Circle' 정식 출시 일정과 한국어 자막 지원 여부는 공식 발표되지 않았으며, 해외 플랫폼(Nintendo eShop 글로벌 판매처)을 통한 구매 가능성을 염두에 둘 필요가 있다. UK 소매가 기준 49.99파운드(약 75,000원대)로 예상되며, Switch 2 한국 출시 시점에 맞춰 정보 공개가 이루어질 것으로 보인다.	{"Nintendo Switch 2","인디아나 존스: 더 그레이트 서클",독점작,"UK 차트","휴대형 게이밍"}	PUBLISHED	2026-05-19 11:08:34.368	2026-05-19 11:08:34.368	0
cmpcj5c14002xaa8aldpyz1pd	Poll: So, Will You Be Getting Yoshi And The Mysterious Book For Switch 2?	https://www.nintendolife.com/news/2026/05/poll-so-will-you-be-getting-yoshi-and-the-mysterious-book-for-switch-2	2026-05-17 14:00:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch 2 독점작 '요시와 신비한 책' 출시 임박... 국내 유저 기대도 '고조'	Nintendo Switch 2의 첫 전용 타이틀 '요시와 신비한 책'이 공개 직전을 앞두면서, 글로벌 커뮤니티의 구매 관심도 높아지고 있다. 닌텐도의 신작 신기기 전략이 국내 유저에게 어떤 영향을 미칠지 주목된다.	Nintendo Switch 2의 공식 출시를 앞두고, 닌텐도의 첫 전용 타이틀(독점작)인 '요시와 신비한 책(Yoshi and the Mysterious Book)'이 해외 게이머들의 관심을 집중시키고 있다. 지난 몇 주간 공개된 게임플레이 영상과 미리보기 정보들을 통해 작품의 전반적인 윤곽이 드러나면서, 신기기 수요를 견인할 킬러 타이틀로서의 가능성이 부각되고 있다.\n\n'요시와 신비한 책'은 닌텐도의 전통적인 플랫포머 게임 설계 철학을 계승하면서도, Switch 2의 향상된 그래픽 성능(업그레이드된 GPU와 DLSS 기반 업스케일링 기술)을 활용해 전작 대비 시각적 풍부함을 극대화한 것으로 평가받고 있다. 닌텐도는 신기기 출시 초기 소프트웨어 라인업을 강화하는 전략으로, 시리즈 주요 프랜차이즈를 Switch 2 전용으로 집중 배분하는 방식을 추진 중이다.\n\n이는 소니의 PlayStation 5 프로, 마이크로소프트의 Xbox Series X|S와 달리, 닌텐도가 하드웨어 세대 교체 시점에 소프트웨어 독점성으로 신기기 가치를 강조하려는 의지를 드러낸 것으로 해석된다. 특히 아동 및 캐주얼 게이머층에 강한 요시 프랜차이즈가 Switch 2의 초기 매력 포인트로 작용할 것으로 예상된다.\n\n**국내 유저 가이드**: '요시와 신비한 책'은 Nintendo Switch 2 독점 타이틀로 국내 정식 발매 예정이며, 한국어 자막 지원 여부는 닌텐도 공식 발표 대기 중이다. 국내 온라인 게임 유통 플랫폼(닌텐도 e숍 한국 스토어)을 통한 구매가 예상되며, 정확한 한국 판매가와 출시 일정은 Switch 2 국내 론칭 공식 공지를 기준으로 확인 가능할 것으로 보인다.	{"Nintendo Switch 2","요시와 신비한 책",독점작,"플랫포머 게임"}	PUBLISHED	2026-05-19 11:08:44.2	2026-05-19 11:08:44.2	0
cmpcj5ly8002yaa8a0c6uani2	Mailbox: Tomodachi Teachings, 'Mainline' Mario, The Artist Formerly Known As Waluigi - Nintendo Life Letters	https://www.nintendolife.com/news/2026/05/mailbox-tomodachi-teachings-mainline-mario-the-artist-formerly-known-as-waluigi-nintendo-life-letters	2026-05-17 13:00:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Life 독자 편지함: 토모다치 철학부터 '정통' 마리오까지, 닌텐도 팬들의 목소리	닌텐도 팬 커뮤니티의 핵심 의제를 담은 5월 독자 편지함 공개... 토모다치 라이프의 철학적 메시지, 마리오 시리즈의 정통성 논의, 와루이지 캐릭터의 위상 변화 등 다양한 주제가 취합됨.	닌텐도 라이프가 5월호 독자 편지함(Mailbox)을 공개했다. 이번 호는 게임 커뮤니티 내에서 오래전부터 논쟁이 되어온 '토모다치 라이프(Tomodachi Life)'의 철학적 의미, 마리오 시리즈의 정통성 정의, 그리고 와루이지 캐릭터의 게임 내 입지에 관한 독자들의 생각을 두루 담아냈다. 닌텐도 팬들이 단순 게임 플레이를 넘어 프랜차이즈 방향성과 스토리텔링에 대해 얼마나 진지하게 고민하고 있는지를 보여주는 사례다.\n\n토모다치 라이프는 Nintendo 3DS의 독특한 소셜 시뮬레이션 게임으로, 실제 유저와 주변인들의 모습을 미이(Mii) 캐릭터로 변환해 '거울 게임'을 경험하게 한다. 이 게임의 철학적 교훈—공동체 내 개인의 역할, 관계의 소중함, 그리고 현실과 게임의 경계 허물기—이 독자들 사이에서 다시금 재조명되고 있다. 특히 Nintendo Switch 세대 유저들이 3DS 타이틀을 재발견하면서, 닌텐도의 '포용성 있는 게임 디자인' 철학에 대한 관심이 높아지고 있다.\n\n마리오 시리즈의 '정통성(Mainline)' 정의 논의도 주목할 만하다. 슈퍼 마리오 브라더스, 슈퍼 마리오 64, 슈퍼 마리오 오디세이 같은 3D 플랫포머가 진정한 '정통' 마리오인가, 아니면 2D 횡스크롤 타이틀이 본질인가 하는 질문은 단순 게임 분류를 넘어 프랜차이즈 정체성의 핵심을 건드린다. 한편, 와루이지라는 캐릭터의 위상 변화—마리오 카트, 마리오 스포츠 시리즈에서는 강캐 취급을 받으면서도 메인 스토리 게임에서는 조연에 머물러 있는 이중성—도 독자들의 흥미로운 지적 대상이 되고 있다.\n\n이러한 편지함 논의는 닌텐도 팬덤의 '텍스트 비평 문화'가 얼마나 성숙했는지를 드러낸다. 단순 게임 소비를 넘어 스토리, 캐릭터, 게임 디자인 철학에 대한 메타 분석이 활발하다는 점은, Nintendo Switch 생태계가 '재미'뿐 아니라 '의미'를 추구하는 플레이어층을 확보하고 있음을 시사한다. Nintendo Life 독자 편지함은 매월 공개되며, 닌텐도 팬이라면 커뮤니티의 수심 있는 목소리를 확인할 수 있는 창구다.	{"Nintendo Switch","닌텐도 라이프","토모다치 라이프","마리오 시리즈",와루이지,"팬 커뮤니티","게임 문화"}	PUBLISHED	2026-05-19 11:08:57.056	2026-05-19 11:08:57.056	0
cmpcj5tvy002zaa8af1l22tpv	Poll: Box Art Brawl: Duel - Galactic Pinball	https://www.nintendolife.com/features/poll-box-art-brawl-duel-galactic-pinball	2026-05-17 09:00:00	Nintendo Life	Console	Nintendo	fixed	Nintendo 박스아트 투표전: '갤럭틱 핀볼' 지역별 디자인 대결... 북미판이 44% 득표로 우위	Nintendo Life의 '박스아트 브롤' 시리즈에서 버비의 지역별 패키지 디자인을 놓고 투표 결과 발표. 북미판이 44%로 1위, 일본판 37%, 유럽판 18% 순으로 집계됐으며, 게이머들의 향수와 미학에 대한 취향 차이를 드러냈다.	Nintendo Life가 진행 중인 '박스아트 브롤' 투표 시리즈에서 클래식 타이틀 '버비 인 클로즈 인카운터 오브 더 퍼드 카인드'의 지역별 패키지 디자인 대결 결과를 공개했다. 북미, 일본, 유럽 총 3개 버전의 박스아트가 비교 대상이 됐으며, 이는 과거 Nintendo의 지역화 전략이 얼마나 다양했는지를 보여주는 사례다.\n\n최종 투표 결과 북미판 디자인이 44%의 득표율로 최다수표를 확보했다. 일본판은 37%로 뒤를 이었으며, 유럽판은 18%에 그쳤다. 북미판이 우위를 점한 이유는 당시 8비트 시대 Western 게임 패키지의 특징적인 색감과 타이포그래피가 글로벌 게이머들 사이에서 더 높은 인지도를 지니고 있기 때문으로 분석된다. 일본판 역시 선전한 것은 파미콤 에라의 미니멀한 디자인 미학에 대한 향수 때문으로 보인다.\n\n이번 투표 시리즈는 단순한 흥미 영위를 넘어 Nintendo의 다지역 마케팅 전략과 각 지역별 문화적 선호도를 이해하는 데 의미가 있다. 1990년대 초반 Nintendo가 각 지역의 소비자 심리와 시장 트렌드에 맞춰 패키지를 별도 제작했던 관행은, 현재 디지털 게임 시장에서는 찾아보기 어려운 지역화 전략이다. Nintendo Life의 이 같은 투표 기획은 레트로 게이밍 커뮤니티 내에서 과거 하드웨어 시대에 대한 향수와 논의를 촉발하는 긍정적 역할을 하고 있다.\n\n[정보 안내] 본 투표는 Nintendo Life의 온라인 투표 시리즈로, 한국 게이머들도 웹사이트를 통해 자유롭게 참여 가능하다. 투표 자체는 무료이며, 추가 정보는 nintendolife.com에서 확인할 수 있다.	{Nintendo,박스아트,커뮤니티투표,레트로게임,지역화}	PUBLISHED	2026-05-19 11:09:07.342	2026-05-19 11:09:07.342	0
cmpcj62rc0030aa8acz6iwdyb	Hamster Wants To Release Hundreds Of Games For Its Console Archives Series	https://www.nintendolife.com/news/2026/05/hamster-wants-to-release-hundreds-of-games-for-its-console-archives-series	2026-05-17 08:00:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch 2, 해ムster의 '콘솔 아카이브' 800개 타이틀 돌파 계획... 아케이드 아카이브 규모 초월	레트로 게임 발굴 전문사 해ムster가 Switch 2용 '콘솔 아카이브' 시리즈를 통해 800개 이상의 클래식 타이틀 확보를 목표로 설정했으며, 이는 기존 아케이드 아카이브의 규모를 넘어설 것으로 전망됨.	레트로 게임 발굴 및 발매 전문사 해мster 코퍼레이션이 Nintendo Switch 2를 위한 '콘솔 아카이브' 라인업을 역사상 최대 규모로 확대하겠다는 의지를 드러냈다. 창립자 겸 CEO인 하마다 사토시(Satoshi Hamada)는 최근 게임 매거진 '패미통'과의 인터뷰에서 현재 진행 중인 아케이드 아카이브(Arcade Archives) 컬렉션의 800타이틀 목표치는 단순한 '통과점'에 불과하며, 콘솔 아카이브는 이를 훨씬 상회할 것이라고 언급했다.\n\n해мster는 이미 올해 초 Switch 2를 위해 콘솔 아카이브 시리즈를 론칭한 상태로, 클래식 콘솔 게임의 디지털화 및 에뮬레이션 기술에서 업계 최고 수준의 최적화 기록을 보유하고 있다. 아케이드 아카이브가 과거 동전 게임기 전성기의 타이틀들을 중심으로 확보된 점과 달리, 콘솔 아카이브는 Nintendo, Sega, Atari 등 가정용 콘솔 세대의 광범위한 라이브러리에 접근할 수 있다는 장점이 있다. Switch 2의 향상된 하드웨어 성능(DLSS 기반 업스케일링, 개선된 배터리 효율)은 과거 저해상도 게임들을 모던 해상도로 재현하는 데 유리한 환경을 제공한다.\n\n이번 발표는 Nintendo의 '클래식 IP 재활용' 전략과 맞물린 움직임으로 해석된다. Switch 2 초기 라인업이 삼자 개발사 신작과 포팅 타이틀에 치중된 점을 감안할 때, 해мster의 대규모 아카이브 구축은 플랫폼 초반 콘텐츠 확충을 위한 중요한 보조 역할을 할 것으로 예상된다. 또한 이는 PlayStation의 클래식 게임 다운로드 서비스 종료 움직임과 대비되는 Nintendo의 차별화된 전략으로도 평가할 수 있다.\n\n해мster 콘솔 아카이브 시리즈의 정식 한국 출시 일정 및 가격 정보는 아직 공식 발표되지 않았으나, 기존 아케이드 아카이브 타이틀들이 Nintendo eShop 한국 스토어에서 개별 구매 가능하므로 유사한 형태의 유통이 예상된다. Switch 2 발매 시점(2025년 상반기 예상)에 대규모 콘솔 아카이브 카탈로그가 동시 지원될 가능성이 높으며, 일부 타이틀의 한국어 자막/더빙 지원 여부는 라이센싱 계약 상황에 따라 개별 결정될 것으로 보인다.	{"Nintendo Switch 2","콘솔 아카이브","레트로 게임",해мster,"디지털 발굴"}	PUBLISHED	2026-05-19 11:09:18.839	2026-05-19 11:09:18.839	0
cmpcj6b6w0031aa8a54ubmmtj	More Nintendo LEGO Sets Are Being Retired Soon	https://www.nintendolife.com/news/2026/05/more-nintendo-lego-sets-are-being-retired-soon	2026-05-17 05:30:00	Nintendo Life	Console	Nintendo	fixed	Nintendo LEGO 공식 라이센스 제품 대량 단종 임박... 마리오·마리오 카트·동물의 숲 시리즈 포함	레고가 Nintendo 라이센스 제품군의 단계적 단종을 진행 중이며, 젤다의 전설에 이어 마리오, 마리오 카트, 동물의 숲 LEGO 세트까지 곧 판매 중단될 예정인 것으로 확인됐다.	레고(LEGO)가 Nintendo 라이센스 제품의 대규모 단종을 추진하고 있다. 지난주 젤다의 전설 LEGO 세트의 단종 소식에 이어, 마리오, 마리오 카트, 동물의 숲 등 Nintendo 대표 IP를 활용한 LEGO 컬렉션도 곧 판매 중단될 것으로 알려졌다. 이는 레고가 정기적으로 구성 제품을 교체하며 신규 시리즈 출시를 위해 진행하는 전략적 단종 정책으로 보인다.\n\n현재 단종 대상으로 확인된 제품군은 마리오 시리즈의 주요 빌딩 세트, 마리오 카트 콜라보레이션 라인, 그리고 동물의 숲 테마 제품들이다. Nintendo와의 라이센스 계약을 바탕으로 지속적으로 신규 IP 기반 세트를 선보이는 레고의 일환으로, 기존 인기 세트들을 단계적으로 정리하고 있는 것으로 해석된다. 레고 공식 홈페이지와 주요 소매 채널에서 해당 제품의 '단종 예정' 표시가 나타나기 시작했으며, 실제 판매 중단 시점은 향후 몇 주 내로 예상된다.\n\nNintendo 라이센스 제품의 단종은 레고 수집가와 게이머 커뮤니티에 영향을 미칠 것으로 보인다. 특히 마리오 브랜드는 레고의 Nintendo 협업 중 가장 인기 높은 라인으로, 건축 난이도와 피규어 퀄리티 모두 호평을 받아왔다. 단종 이전에 남은 재고를 구매하려는 수집가들의 수요 급증이 예상되며, 향후 공식 단종 후에는 중고시장에서의 프리미엄 가격 상승도 예상된다.\n\n**국내 구매 가이드**: 현재 국내 공식 LEGO 플래그십 스토어 및 주요 온라인 마켓(쿠팡, 네이버 스마트 스토어 등)에서 해당 Nintendo 테마 세트들을 정가(약 4만~15만 원대, 세트 규모별)로 구매 가능하다. 단종 임박 제품의 경우 재고 소진이 빠르게 진행될 수 있으니, 수집 또는 선물 용도라면 조기 구매를 권장한다. 한국 레고 공식 사이트(lego.com/ko-kr)에서도 '단종 예정' 제품 정보를 확인할 수 있다.	{Nintendo,LEGO,"라이센스 제품","단종 소식"}	PUBLISHED	2026-05-19 11:09:29.768	2026-05-19 11:09:29.768	0
cmpcj6ld20032aa8a9yrn1ego	Guide: Best Indiana Jones Games, Ranked - Switch And Nintendo Platforms	https://www.nintendolife.com/guides/best-indiana-jones-games-ranked-switch-and-nintendo-platforms	2026-05-16 15:00:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch 플랫폼 인디아나 존스 게임 완벽 가이드 - '위대한 서클'까지 포함한 역대 최고 명작 랭킹	Xbox 독점작에서 멀티플랫폼으로 확대된 '인디아나 존스와 위대한 서클'의 Switch 2 출시를 계기로, Nintendo 플랫폼에서 플레이 가능한 인디아나 존스 게임 전작을 종합 평가한 전문 가이드.	인디아나 존스 프랜차이즈가 게임 시장에서 재조명받고 있다. Bethesda의 '인디아나 존스와 위대한 서클'이 당초 Xbox 독점작에서 출발해 PlayStation 5와 Switch 2로까지 플랫폼을 확대하면서, 게이밍 커뮤니티에서 역대 인디아나 존스 게임들을 재평가하는 흐름이 이어지고 있다. 특히 Nintendo 진영 유저들 사이에서는 Switch와 과거 Nintendo 콘솔에서 발매된 인디아나 존스 타이틀들의 가치를 다시금 주목하는 상황이다.\n\nNintendo 플랫폼의 인디아나 존스 게임 라이브러리는 NES 시절의 고전작부터 최신 멀티플랫폼 타이틀까지 다양한 세대를 아우르고 있다. 1980~90년대 발매된 클래식 타이틀들은 당시 8비트, 16비트 아키텍처 내에서 원작의 모험심을 담아낸 의미 있는 작품들이며, 이들은 현대적 리마스터링이나 Nintendo Switch Online 서비스를 통해 재발견되고 있는 중이다. 특히 '위대한 서클'의 AAA급 모험 게임플레이와 비교했을 때, 과거 타이틀들이 보여준 '제약 속의 창의성'이 오히려 게임 역사적 가치로 재평가되는 추세다.\n\n이러한 회고 열풍은 Nintendo의 하드웨어 로드맵과도 맞물려 있다. Switch 2 출시 시점에 '위대한 서클' 같은 AAA급 타이틀이 함께 공급되면서, Nintendo 유저들도 최신 콘솔 게임 시장의 중심에 진입할 수 있게 된 것이다. 동시에 역대 인디아나 존스 게임들을 '시리즈 진화의 맥락'에서 바라보는 것은 Nintendo 플랫폼의 게임 문화적 지위를 한 단계 격상시키는 기회가 될 수 있다.\n\n국내 Nintendo 유저들이 확인해야 할 정보는 다음과 같다. '인디아나 존스와 위대한 서클'은 Switch 2 출시 이후 정식 공급 예정이며, 한국어 자막 지원 여부는 Bethesda의 공식 입장 대기 중이다. 과거 NES, SNES 시절 인디아나 존스 타이틀들은 Nintendo Switch Online(패밀리 컴퓨터 및 슈퍼 패밀리 컴퓨터 라이브러리) 구독을 통해 일부 접근 가능하며, 상세한 타이틀별 출시 가격 및 국내 정식 유통 정보는 Nintendo 공식 채널 및 국내 게임 유통사 공지를 통해 확인할 수 있다.	{"Nintendo Switch","Nintendo Switch 2","인디아나 존스와 위대한 서클","멀티플랫폼 출시","게임 역사"}	PUBLISHED	2026-05-19 11:09:41.444	2026-05-19 11:09:41.444	0
cmpcj6tlx0033aa8auk3y35r1	Review: Dbrand Switch 2 Joy-Lock Controller Holder - "Even More Comfortable" Than Nintendo's Pro Pad? Let's See	https://www.nintendolife.com/reviews/dbrand-switch-2-joy-lock-controller-holder-even-more-comfortable-than-nintendos-pro-pad-lets-see	2026-05-16 13:00:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch 2 써드파티 악세서리 생태계 확장... Dbrand의 'Joy-Lock' 컨트롤러 홀더 출시	캐나다 주변기기 제조사 Dbrand가 Nintendo Switch 2용 'Joy-Lock 컨트롤러 홀더'를 공개했으며, 공식 Pro 컨트롤러 대비 80% 저렴하면서도 더 나은 그립감을 제공한다는 마케팅으로 업계의 관심을 끌고 있다.	Nintendo Switch 2의 정식 출시를 앞두고 써드파티 액세서리 시장이 본격 움직이기 시작했다. 캐나다의 주변기기 전문 제조사 Dbrand가 공개한 'Joy-Lock 컨트롤러 홀더'는 분리형 Joy-Con의 그립감 문제를 해결하기 위한 솔루션으로 주목받고 있다. 특히 Dbrand의 파격적인 마케팅 메시지는 Nintendo의 공식 Pro 컨트롤러에 정면으로 도전하는 포지셔닝을 시도하고 있다는 점에서 흥미롭다.\n\nDbrand의 Joy-Lock은 Nintendo의 정식 Pro 컨트롤러 가격 대비 약 80% 저렴한 가격대에 책정되면서도 사용성 면에서는 우위에 있다고 주장하고 있다. 이는 Nintendo Switch 2 초기 구매층들이 추가 컨트롤러 투자에 대한 부담을 느낄 수 있다는 시장 분석에 기반한 것으로 보인다. Dbrand는 기술적 세부사항보다 체감 그립감(ergonomics)을 강조하는 마케팅 전략을 통해 가성비 지향 유저층을 명확히 타겟팅하고 있다.\n\nSwitch 2 출시 초기 단계에서 이같은 써드파티 액세서리의 대량 유입은 Nintendo의 순정 액세서리 수익성에 직접적인 영향을 미칠 수 있다는 점에서 주목할 가치가 있다. 다만 Dbrand는 과거 마케팅 논란으로 인한 부정적 여론을 거듭 경험한 만큼, 한국 게이머들 사이에서 브랜드 신뢰도가 낮을 수 있다는 한계가 있다. Switch 2의 공식 출시가 임박한 만큼 순정 vs 써드파티 액세서리 간 성능 비교 리뷰가 커뮤니티 내에서 활발히 진행될 것으로 예상된다.\n\n【구매 가이드】Dbrand Joy-Lock 컨트롤러 홀더의 한국 정식 출시 가격 및 국내 판매처는 아직 공식 발표되지 않았으며, 현재 해외 직구 경로를 통한 선주문이 가능할 것으로 예상된다. Nintendo Switch 2 공식 Pro 컨트롤러는 국내 정식 가격이 약 8만~9만 원대로 책정될 것으로 전망되므로, Dbrand 제품이 1만 5천~2만 원대의 가격대에 진입할 경우 가성비 옵션으로서의 입지가 확보될 가능성이 높다. 한국어 설명서 지원 여부는 확인 중이며, Switch 2 정식 출시 일정에 따라 국내 유통사의 공식 판매 개시 시점이 결정될 예정이다.	{"Nintendo Switch 2",Joy-Con,액세서리,Dbrand,컨트롤러,써드파티}	PUBLISHED	2026-05-19 11:09:53.638	2026-05-19 11:09:53.638	0
cmpcj71td0034aa8amr8iv0th	Video: IO Interactive Chats With The Star Of Its New Game '007 First Light'	https://www.nintendolife.com/news/2026/05/video-io-interactive-chats-with-the-star-of-its-new-game-007-first-light	2026-05-16 11:00:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch로 돌아오는 007, 패트릭 깁슨이 직접 말하는 '첫 임무'의 모든 것	IO Interactive가 차기작 '007 First Light'의 주연배우 패트릭 깁슨과의 인터뷰를 공개하며 멀티플랫폼 출시를 앞두고 마케팅을 본격화했습니다. Nintendo Switch 버전 출시 임박에 따른 기대감 고조.	IO Interactive가 개발한 신작 '007 First Light'의 공식 마케팅에 본격 가속도가 붙었습니다. 아일랜드 배우 패트릭 깁슨이 007 역을 맡은 이번 작품은 Nintendo Switch를 포함한 다중 플랫폼으로 이달 말 출시될 예정이며, IO Interactive는 게임의 스토리텔링과 캐스팅 수준을 강조하기 위해 주요 배우들과의 인터뷰 시리즈를 진행 중입니다.\n\n패트릭 깁슨과의 인터뷰를 통해 공개된 내용에 따르면, 본 게임은 단순한 라이선스 게임을 넘어 영화 수준의 시나리오와 성우 연기를 목표로 제작됐습니다. IO Interactive는 과거 'Hitman' 시리즈로 스텔스 게임플레이의 깊이를 입증한 개발사인 만큼, 이번 007 게임도 스파이 액션의 자유도와 미션 디자인에 상당한 공을 들였을 것으로 예상됩니다. Nintendo Switch 버전은 하드웨어의 성능 한계를 고려한 최적화가 이루어져 있을 것으로 보입니다.\n\n소니와 마이크로소프트가 주도권을 잡고 있는 3A급 액션 게임 시장에서 Nintendo Switch도 동시 출시 타이틀로 포함되는 것은 이 게임의 멀티플랫폼 전략이 얼마나 중요한 위치에 있는지를 보여줍니다. 특히 국내 닌텐도 팬층이 꾸준한 만큼, Switch 버전의 현지화와 안정적 성능은 출시 후 평가를 크게 좌우할 수 있는 요소입니다.\n\n007 First Light는 이달 말(2025년 1월 예정) Nintendo Switch, PlayStation, Xbox 등 주요 플랫폼에 동시 출시됩니다. 국내 정식 발매 여부는 아직 공식 공지가 없으나, IO Interactive의 과거 타이틀들(Hitman 3 등)이 국내에 정식 발매된 전례를 감안하면 한글화 지원 가능성이 높습니다. 구체적인 가격대 및 출시 일정은 추가 공지를 기다리고 있습니다.	{"Nintendo Switch","007 First Light","IO Interactive","멀티플랫폼 출시"}	PUBLISHED	2026-05-19 11:10:04.273	2026-05-19 11:10:04.273	0
cmpcj7csw0035aa8a1t52y4g4	Talking Point: What Are You Playing This Weekend? (16th May)	https://www.nintendolife.com/features/talking-point-what-are-you-playing-this-weekend-16th-may	2026-05-16 09:00:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch 2 '게임 선택 번들' 한정판 공개... 미국 선행 출시로 가격 인상 전 수급 전략 강화	닌텐도가 미국 시장에 한정판 'Choose Your Game' Switch 2 번들을 공개했으며, 이는 예정된 가격 인상 이전에 판매량 확보를 위한 전략으로 분석된다.	닌텐도가 미국 시장을 중심으로 Switch 2의 한정판 번들 구성을 공개하며 전략적 수급 관리에 나섰다. 이번 'Choose Your Game' 번들은 사용자가 동봉 게임을 선택할 수 있는 형식으로, 다양한 장르의 이용자층을 동시에 포섭하려는 의도가 드러난다. 닌텐도의 최근 재정 보고서와 Star Fox 신작 발표에 이어 나온 소식으로, 시장의 기대감이 조기 수요로 이어지고 있는 상황이다.\n\n이번 번들 구성은 Switch 2의 발매 초기 성공을 뒷받침하기 위한 전술로 평가된다. 한정판 번들을 통해 닌텐도는 개별 소프트웨어 구매 진입 장벽을 낮추면서, 동시에 하드웨어 판매량 극대화를 노릴 수 있다. 특히 예정된 가격 인상 이전에 이러한 번들을 출시함으로써 현재 가격대에서의 수급을 촉진하는 전략이 관찰된다.\n\n닌텐도의 이러한 움직임은 Switch 2 생애주기 초반 플랫폼 확보 전쟁에 집중하겠다는 신호로 해석된다. 미국 시장에서의 선행 출시 전략을 통해 글로벌 수요를 시뮬레이션하고, 이를 국내 정식 출시 시점의 수급 계획에 반영할 가능성이 높다. Switch 2는 현세대 모바일 하이브리드 플랫폼의 후속 기종으로서 닌텐도의 핵심 사업축을 이루는 만큼, 이번 번들 전략은 연간 하드웨어 판매 목표 달성의 초석이 될 것으로 전망된다.\n\n국내 Switch 2 정식 발매 시점과 가격대는 아직 공식 발표되지 않았다. 현재 미국 시장에 공개된 'Choose Your Game' 번들의 국내 정식 출시 계획 및 한국어 게임 라인업 구성에 대해서는 닌텐도 코리아의 추가 공지를 기다리는 상황이다. 해외 선행 정보에 따르면 Switch 2는 2025년 상반기 내 국내 정식 출시가 예상되며, 최신 소식은 공식 닌텐도 채널을 통해 지속적으로 확인할 필요가 있다.	{Nintendo,"Nintendo Switch 2",하드웨어,"한정판 번들"}	PUBLISHED	2026-05-19 11:10:18.512	2026-05-19 11:10:18.512	0
cmpcj7kxu0036aa8a7ell2f9t	Elden Ring And The Duskbloods Still "Expected" To Release On Switch 2 In 2026	https://www.nintendolife.com/news/2026/05/elden-ring-and-the-duskbloods-still-expected-to-release-on-switch-2-in-2026	2026-05-16 06:00:00	Nintendo Life	Console	Nintendo	fixed	Nintendo Switch 2, 2026년 'ELDEN RING: 타니쉬드 에디션'과 '더 더스크블러즈' 동시 출시 확정	카도카와 최신 실적 보고서에서 FromSoftware의 대작 2종이 Switch 2에서 2026년 출시될 예정임을 재확인. 차세대 휴대형 콘솔의 성능 기대감이 높아지고 있습니다.	FromSoftware의 모회사인 카도카와가 공개한 최신 실적 보고서에서 'ELDEN RING: 타니쉬드 에디션'과 'The Duskbloods' 두 타이틀이 Nintendo Switch 2에 2026년 출시될 예정임을 재확인했습니다. 이는 Switch 2의 출시 라인업에서 AAA급 3D 액션 RPG가 핵심축을 이룰 것임을 의미하며, 차세대 닌텐도 플랫폼의 하드웨어 성능 기대감을 한층 높이고 있습니다.\n\n'ELDEN RING'은 원본 PS5/Xbox Series X|S 버전에서 4K 60fps 구동이 기준인 만큼, Switch 2에서의 포팅 품질이 주목됩니다. 카도카와의 실적 보고서는 단순 출시 공약에 그치지 않고 회계 연도 말 기준 운영 계획으로 명시된 것으로, 개발 일정에 상당한 신뢰도가 붙는 상황입니다. 또한 'The Duskbloods'는 FromSoftware의 신규 IP로, Switch 2 독점 또는 타이밍 독점 가능성도 배제할 수 없습니다.\n\nSwitch 2는 이전 세대 대비 대폭 상향된 GPU 성능을 갖춘 것으로 알려져 있으며, 이는 ELDEN RING 같은 고사양 타이틀을 안정적으로 구동할 수 있는 기반을 제공합니다. 닌텐도는 차세대 기기 초기 라인업을 FromSoftware라는 업계 최고의 액션 게임 개발사와의 협력으로 포진함으로써, 하드코어 게이머층에 어필하려는 전략 의지가 드러난 상황입니다.\n\n**국내 출시 정보** - 'ELDEN RING: 타니쉬드 에디션'은 기존 버전 대비 신규 콘텐츠(보스, 시나리오)를 포함한 에디션으로 정식 출시 가격은 공식 미공지 상태입니다(참고: PS5 기준 약 59,800원대). 한국어 자막 지원은 원본 ELDEN RING과 동일하게 제공될 예정이며, 'The Duskbloods'의 국내 한국어화 지원 여부는 아직 별도 공지가 없습니다. Switch 2의 정식 국내 출시 일정 공개 시 함께 예약 정보가 공개될 것으로 예상됩니다.	{"Nintendo Switch 2","ELDEN RING",FromSoftware,"2026 라인업","액션 RPG","차세대 게임기"}	PUBLISHED	2026-05-19 11:10:29.058	2026-05-19 11:10:29.058	0
cmpcj7qsd0037aa8a6pdg9eu3	KT 롤스터, 키움 DRX 완파 2:0 승리…11승 3패로 상승세 지속	lck-match-115548128962906303	2026-04-22 08:00:00	lolesports	Esports	LCK	fixed	KT 롤스터, 키움 DRX 완파 2:0 승리…11승 3패로 상승세 지속	4주 차 22일 오후 8시 KT 롤스터가 키움 DRX와의 BO3 경기에서 2:0으로 완파했다. KT는 11승 3패로 기록을 늘렸고, DRX는 4승 10패에 머물렀다.	KT 롤스터가 22일 키움 DRX를 상대로 2:0 셧아웃 승리를 거두며 상위권 자리를 공고히 했다. 이날 경기는 풀세트 접전 양상으로 전개됐으나 KT가 두 세트 모두를 제압하며 완승을 기록했다.\n\n이번 승리로 KT는 11승 3패의 전적을 달성해 현재 리그 상위권 포지션을 유지하고 있다. 반면 DRX는 4승 10패에 머물며 하위권 순위에 조기 락인되는 상황이다. KT는 최근 경기력 상승세를 이어가며 연승 가도를 이어가는 중으로 보인다.\n\n4주 차 경기를 마치며 KT는 향후 일정에서도 상위 순위 경쟁에 치열하게 참여할 것으로 예상된다. 한편 DRX는 매주 기록을 더하지 못하며 리그 극하위에서의 재도약 전략 수립이 시급한 상황으로 평가된다.	{LCK,"KT 롤스터","키움 DRX","2:0 완파","4주 차",이스포츠}	PUBLISHED	2026-05-19 11:10:36.637	2026-05-19 11:10:36.637	0
cmpcj7v4t0038aa8aj70y94ox	한화생명 e스포츠, 농심 레드포스 꺾고 풀세트 접전 신승	lck-match-115548128962840623	2026-04-22 10:00:00	lolesports	Esports	LCK	fixed	한화생명 e스포츠, 농심 레드포스 꺾고 풀세트 접전 신승	4주 차 22일 진행된 한화생명 e스포츠 vs 농심 레드포스의 BO3 경기에서 한화생명이 2:1로 승리, 12승 2패 전적을 기록했다.	한화생명 e스포츠는 22일 오전 LCK 4주 차 경기에서 농심 레드포스와의 풀세트 접전을 2:1로 제압했다. 이번 승리로 한화생명은 현재 12승 2패의 전적을 거두며 상위권 위치를 굳혔다.\n\n본 경기는 세트 단위에서 양 팀이 치열한 공방을 펼쳤으나, 결국 한화생명이 최종 세트에서의 승리로 경기를 마감했다. 한화생命은 4주 차를 거치며 높은 승률을 유지하고 있으며, 농심 레드포스는 4승 10패의 기록으로 리그 하위권에 머물러 있다.\n\n한화생명 e스포츠는 현재의 강한 모멘텀을 이어 다음 경기에서도 상위권 자리 확보에 집중할 것으로 보인다. 한편 농심 레드포스는 패배 이후 전적 개선을 위한 전술 재정비가 시급할 것으로 판단된다.	{LCK,"한화생명 e스포츠","농심 레드포스",2:1,"풀세트 접전"}	PUBLISHED	2026-05-19 11:10:42.27	2026-05-19 11:10:42.27	0
cmpcj7z6a0039aa8afzazcgbc	디플러스 기아, 한진 브리온 완파…중위권 경쟁 심화	lck-match-115548128962906255	2026-04-23 08:00:00	lolesports	Esports	LCK	fixed	디플러스 기아, 한진 브리온 완파…중위권 경쟁 심화	4주차 23일 디플러스 기아가 한진 브리온을 2:0으로 셧아웃, 7승 7패로 동점 승수를 기록했으며 브리온은 6승 8패로 하락.	23일 오전 8시 진행된 LCK 4주차 경기에서 디플러스 기아가 한진 브리온을 2:0으로 완파했다. 두 팀 모두 접전을 펼쳤으나 기아가 세트 운영에서 우위를 점하며 풀세트 접전 끝 승리를 확보했다.\n\n이 승리로 디플러스 기아는 7승 7패의 동점 전적을 기록하며 중위권 경쟁에서 발판을 마련했다. 반면 한진 브리온은 6승 8패로 하락하며 상위권 진출의 어려움을 드러냈다. 현재 리그 전체 판도에서 중위권 팀들 간의 경쟁이 심화되고 있는 상황이다.\n\n디플러스 기아는 이번 승리를 바탕으로 후속 경기에서 상승 기류를 이어가야 할 상황이며, 한진 브리온은 연패 기조를 꺾기 위해 즉각적인 전술 개선이 요구된다.	{LCK,"디플러스 기아","한진 브리온","2:0 완파",4주차}	PUBLISHED	2026-05-19 11:10:47.506	2026-05-19 11:10:47.506	0
cmpcj83fl003aaa8a7knwsn0d	젠지, DN 수퍼스 완파…10승 4패로 상위권 굳건	lck-match-115548128962906231	2026-04-23 10:00:00	lolesports	Esports	LCK	fixed	젠지, DN 수퍼스 완파…10승 4패로 상위권 굳건	4주 차 23일, 젠지가 DN 수퍼스를 2:0으로 셧아웃. 젠지는 10승 4패 기록으로 순위권 유지, DN 수퍼스는 1승 13패로 하단 고착화.	젠지는 23일 오전 10시 DN 수퍼스와의 경기에서 2:0 완승을 거두며 압도적인 경기력을 입증했다. 4주 차 BO3 경기는 풀세트 접전이었으나 젠지가 연이은 승리로 경기를 마감했다.\n\n이번 승리로 젠지는 10승 4패의 전적을 기록하며 리그 상위권 위치를 확실히 했다. 반면 DN 수퍼스는 1승 13패로 리그 하단에 머물면서 승점 확보에 어려움을 겪고 있다. 젠지는 지속된 승리로 리그 판도에서 중상위권 자리를 굳히는 중이다.\n\n젠지는 4주 차 이후 일정에서 추가 승점 확보가 예정되어 있으며, 리그 상위권 팀들과의 경쟁에서 위치를 다지는 것이 과제로 남아있다. 한편 DN 수퍼스는 대대적인 기량 개선이 요구되는 상황이다.	{LCK,젠지,DN수퍼스,2:0,완파,4주차}	PUBLISHED	2026-05-19 11:10:53.025	2026-05-19 11:10:53.025	0
cmpcj87p4003baa8aokmvuiem	KT 롤스터, BNK 피어엑스 완파…11승 3패로 선두 탈진	lck-match-115548128962906215	2026-04-24 08:00:00	lolesports	Esports	LCK	fixed	KT 롤스터, BNK 피어엑스 완파…11승 3패로 선두 탈진	4월 24일 KT 롤스터가 BNK 피어엑스와의 BO3 경기에서 2:0으로 승리. KT는 11승 3패 최상위 성적을 유지하며 선두 경쟁에 돌입했다.	KT 롤스터가 4주 차 정규시즌 경기에서 BNK 피어엑스를 2:0으로 셧아웃했다. 24일 오전 진행된 이번 경기는 풀세트 접전 속에서도 KT의 일관된 경기력이 돋보인 만남이었다.\n\nKT 롤스터는 이번 승리로 11승 3패의 전적을 기록하며 리그 선두 그룹에 확실히 자리 잡았다. 반면 BNK 피어엑스는 5승 9패로 후반부 순위권 경쟁에서 밀리고 있다. 최근 KT의 상승세는 리그 판도에 영향을 미칠 것으로 예상된다.\n\n4주 차를 마무리하는 KT는 앞으로의 일정에서도 현 순위를 유지하기 위한 승리가 필수적이다. BNK는 연이은 패배를 멈추고 하위권 탈출을 위한 재정비 시점이 도래했다.	{LCK,KT롤스터,BNK피어엑스,2:0,4주차}	PUBLISHED	2026-05-19 11:10:58.552	2026-05-19 11:10:58.552	0
cmpcj8c1z003caa8a3mnyhtsf	한화생명, 키움 DRX 완파…4주 차 승리로 선두 자리 굳히기	lck-match-115548128962840627	2026-04-24 10:00:00	lolesports	Esports	LCK	fixed	한화생명, 키움 DRX 완파…4주 차 승리로 선두 자리 굳히기	4월 24일 진행된 LCK 4주 차 경기에서 한화생명 e스포츠가 키움 DRX를 2:0으로 셧아웃. 한화생명은 12승 2패로 순위 경쟁을 주도하는 가운데 연승 기록을 이어가고 있다.	한화생명 e스포츠가 4월 24일 오전 10시(UTC) 키움 DRX와의 경기에서 2:0의 완승을 거두었다. 본 경기는 LCK 정규시즌 4주 차 일정으로 BO3 포맷으로 진행되었으며, 한화생명이 두 세트를 연속으로 장악하면서 풀세트 접전 구도를 피했다.\n\n이 승리로 한화생능 e스포츠는 12승 2패의 전적을 기록하며 리그 상단에 위치를 공고히 하고 있다. 반면 키움 DRX는 이 경기에서 패배하면서 4승 10패의 전적을 남겼으며, 현재 리그 중하위권에서 분전 중이다.\n\n한화생명은 이번 승리를 바탕으로 후속 경기에서도 가동력을 유지해야 할 것으로 보인다. 한편 키움 DRX는 우승 가능성을 높이기 위해 남은 일정에서 승률 개선이 시급한 상황이다.	{LCK,"한화생명 e스포츠","키움 DRX","2:0 셧아웃","4주 차",정규시즌}	PUBLISHED	2026-05-19 11:11:04.199	2026-05-19 11:11:04.199	0
cmpcj8ghw003daa8ayhzba7fn	T1, 한진 브리온 2:0 완파…10승 달성	lck-match-115548128962840639	2026-04-25 08:00:00	lolesports	Esports	LCK	fixed	T1, 한진 브리온 2:0 완파…10승 달성	LCK 4주차(4월 25일) T1이 한진 브리온을 2:0으로 셧아웃하며 10승 4패 기록을 세웠다. 풀세트 접전 속 무난한 승리 확보.	4주차 경기가 열린 4월 25일(한국시간), T1은 한진 브리온과의 BO3 대전에서 2:0 스코어로 압도했다. 양 팀의 접전이 예상됐으나 T1이 두 세트 모두 주도권을 장악하며 풀세트 전개 속 상대를 꺾어냈다.\n\n이번 승리로 T1은 현재 10승 4패의 전적을 기록하며 상위권 포지션을 굳히고 있다. 한편 한진 브리온은 6승 8패로 중하위권에 머물게 됐으며, 추가 상승을 위한 연승이 시급한 상황이 됐다.\n\nT1은 다음 경기에서의 추진력 유지가 핵심 과제다. 현재의 강세를 바탕으로 승점 누적을 지속할 경우 시즌 상반기 최강자 위치를 공고히 할 수 있을 것으로 예상된다.	{LCK,T1,"한진 브리온","2:0 승리",4주차,이스포츠}	PUBLISHED	2026-05-19 11:11:09.956	2026-05-19 11:11:09.956	0
cmpcj8mmm003eaa8a1fzjxzwl	디플러스 기아, DN 수퍼스 2:0 완파…4주 차 승점 확보	lck-match-115548128962906235	2026-04-25 10:00:00	lolesports	Esports	LCK	fixed	디플러스 기아, DN 수퍼스 2:0 완파…4주 차 승점 확보	2026 LCK 4주 차, 디플러스 기아가 DN 수퍼스를 2:0으로 셧아웃했다. 경기는 25일 오전 10시에 진행됐으며, 디플러스 기아는 7승 7패로 기록을 동점화했다.	디플러스 기아가 4주 차 DN 수퍼스전에서 2:0 완승을 거두며 중원 선점에 나섰다. 25일 오전 10시 진행된 본 경기에서 디플러스 기아는 풀세트 접전의 양 세트를 모두 따내며 상대를 압도했다.\n\n이번 승리로 디플러스 기아는 전적을 7승 7패로 정리하며 승패를 동점화했다. 반면 DN 수퍼스는 1승 13패로 현재 리그 최하위 기록을 이어가고 있으며, 하위권 팀들 간 경쟁이 심화되는 양상을 보여주고 있다.\n\n4주 차 경기 결과는 향후 플레이오프 진출권을 놓고 벌어질 중원대 팀들 간의 경쟁에 영향을 미칠 것으로 예상된다. 디플러스 기아는 다음 경기를 통해 상승세를 이어갈 수 있을지 주목된다.	{LCK,"디플러스 기아","DN 수퍼스","2:0 완승","4주 차"}	PUBLISHED	2026-05-19 11:11:17.902	2026-05-19 11:11:17.902	0
cmpcj8r7n003faa8ah1nroxfg	T1, BNK 피어엑스 2:0 완파…4주차 승리로 선두권 지배력 강화	lck-match-115548128962840631	2026-04-26 08:00:00	lolesports	Esports	LCK	fixed	T1, BNK 피어엑스 2:0 완파…4주차 승리로 선두권 지배력 강화	26일 오전 8시 진행된 4주차 경기에서 T1이 BNK 피어엑스를 2:0으로 셧아웃, 10승 4패로 상위권 입지를 공고히 했다.	T1이 26일 오전 8시 진행된 LCK 2026 시즌 4주차 경기에서 BNK 피어엑스를 2:0으로 제압했다. 풀세트 접전 끝의 완승으로 확인됐으며, T1은 현재 10승 4패의 전적을 기록하고 있다.\n\n이번 승리로 T1은 리그 상위권 경쟁에서 우위를 점하며 연승 기록을 이어가고 있다. 반면 BNK 피어엑스는 5승 9패의 전적으로 리그 하위권에 머물러 있으며, 추가 승점 획득에 실패하면서 순위 상향 조정이 더욱 어려워진 상황이다. 두 팀의 전력 격차는 이번 경기 결과에서 명확하게 드러났다.\n\nT1은 이번 승리를 발판으로 리그 주도권 다툼을 계속 이어갈 것으로 예상된다. 반면 BNK 피어엑스는 가중된 저점 전적을 만회하기 위해 앞으로의 경기들에서 선전이 절실한 상황으로 분석된다.	{LCK,T1,"BNK 피어엑스","2:0 완파",4주차,"2026 시즌"}	PUBLISHED	2026-05-19 11:11:23.842	2026-05-19 11:11:23.842	0
cmpcj8vaq003gaa8a5gkvj3rw	젠지, 농심 레드포스 완파 '셧아웃'…4주차 승리 행진	lck-match-115548128962906279	2026-04-26 10:00:00	lolesports	Esports	LCK	fixed	젠지, 농심 레드포스 완파 '셧아웃'…4주차 승리 행진	26일 LCK 4주차 경기에서 젠지가 농심 레드포스를 2:0으로 완파했다. 젠지는 10승 4패로 승점을 쌓아올렸으며, 농심 레드포스는 4승 10패의 기록을 남겼다.	2026년 4월 26일 진행된 LCK 4주차 경기에서 젠지가 농심 레드포스와의 BO3 대전에서 2:0으로 셧아웃을 기록했다. 이번 경기는 풀세트 접전 끝에 젠지의 승리로 결정되었다.\n\n이번 승리로 젠지는 10승 4패의 전적을 기록하며 상위권 순위 경쟁에서 우위를 점하고 있다. 반면 농심 레드포스는 4승 10패로 하위권에 머물러 있으며, 이번 패배로 승률 개선의 시급함이 드러났다.\n\n젠지는 이번 승리로 연승 기조를 이어가며 향후 경기들에서도 강한 모멘텀을 유지할 수 있을 것으로 예상된다. 농심 레드포스는 내일 이후 경기에서 분위기 반전의 기회를 노려야 할 상황이다.	{LCK,젠지,"농심 레드포스","2:0 완파",셧아웃,4주차,이스포츠}	PUBLISHED	2026-05-19 11:11:29.138	2026-05-19 11:11:29.138	0
cmpcj8zch003haa8asgmhxget	T1, 농심 레드포스 완파…10승 4패로 선두 질주	lck-match-115548128962840655	2026-04-29 08:00:00	lolesports	Esports	LCK	fixed	T1, 농심 레드포스 완파…10승 4패로 선두 질주	2026년 4월 29일 LCK 5주 차 경기에서 T1이 농심 레드포스를 2:0으로 셧아웃하며 10승 4패 기록을 수립했다.	T1이 29일 농심 레드포스와의 BO3 매치에서 2:0 완승을 거두며 승수를 10승으로 늘렸다. 이번 경기는 양 팀의 세트별 경쟁이 팽팽했으나, 최종 스코어는 T1의 완파로 결정됐다.\n\nT1은 현재 10승 4패의 전적으로 리그 상단부를 점유하고 있으며, 이번 승리로 연승 가도를 이어나갔다. 반면 농심 레드포스는 4승 10패의 부진한 성적으로 하위권에 머물고 있으며, 이번 패배로 더욱 어려운 상황에 처하게 됐다.\n\n향후 T1의 일관된 경기력 유지 여부와 농심 레드포스의 재정비 과정이 리그 후반부 순위 변동에 영향을 미칠 것으로 예상된다.	{LCK,T1,"농심 레드포스","2:0 완파",5주차,이스포츠}	PUBLISHED	2026-05-19 11:11:34.385	2026-05-19 11:11:34.385	0
cmpcj94eu003iaa8aeniojh7l	한화생명 e스포츠, KT 롤스터 2:0 완파…5주 차 최강자 입증	lck-match-115548128962840619	2026-04-29 10:00:00	lolesports	Esports	LCK	fixed	한화생명 e스포츠, KT 롤스터 2:0 완파…5주 차 최강자 입증	29일 한화생명 e스포츠가 KT 롤스터와의 5주 차 경기에서 2:0으로 승리, 12승 2패 단독 선두 유지. 풀세트 접전 끝에 거둔 승리로 두 팀 간 우위 관계 확립했다.	한화생명 e스포츠가 29일 오전 10시 KT 롤스터와의 BO3 경기에서 2:0 스코어로 상대를 격침했다. 5주 차 경기에서 두 팀이 펼친 이번 대결은 풀세트 접전 끝 한화생명 e스포츠의 승리로 귀결됐다.\n\n이 승리로 한화생명 e스포츠는 12승 2패의 전적을 기록해 현재 리그 단독 선두를 유지하게 됐다. 반면 KT 롤스터는 11승 3패로 기록되며 미세한 격차로 2위 자리를 지키고 있다. 한화생명 e스포츠의 연승 가도는 계속되고 있으며, 이번 승리는 두 팀 간의 직접 대결에서의 우위 관계를 명확히 한 경기로 평가된다.\n\n한화생명 e스포츠는 향후 일정에서 현재의 무적 기세를 어떻게 이어갈지가 주목되는 가운데, KT 롤스터는 이번 패배를 만회하기 위한 다음 경기 준비에 집중해야 할 시점에 도달했다. 5주 차를 기점으로 리그 판도가 어떻게 재편될지 팬들의 관심이 집중되고 있다.	{LCK,"한화생명 e스포츠","KT 롤스터","2:0 승리","5주 차",BO3}	PUBLISHED	2026-05-19 11:11:40.95	2026-05-19 11:11:40.95	0
cmpcj995a003jaa8a94e2qf0i	젠지, 키움 DRX 꺾고 풀세트 접전 신승…10승 4패로 선두 유지	lck-match-115548128962906283	2026-04-30 08:00:00	lolesports	Esports	LCK	fixed	젠지, 키움 DRX 꺾고 풀세트 접전 신승…10승 4패로 선두 유지	2026 LCK 5주차(4월 30일), 젠지가 키움 DRX와의 BO3 경기에서 2:1로 승리. 젠지는 10승 4패로 순위를 지키며 키움 DRX는 4승 10패로 밀려났다.	젠지가 30일 오전 8시(한국시간) 키움 DRX와 벌인 LCK 5주차 경기에서 2:1의 풀세트 접전 끝 승리를 거둬 연승 기록을 이어갔다. 최종 스코어는 1:1로 팽팽하던 세 번째 게임에서 젠지가 주도권을 확보해 가져간 승리다.\n\n이번 승리로 젠지는 10승 4패의 전적으로 현재 리그 선두 자리를 지켜냈다. 반면 키움 DRX는 4승 10패의 부진한 성적으로 하위권에 머물렀으며, 이번 패배로 선수단의 전력 정비와 경기력 개선이 시급한 상황이 확인됐다.\n\n젠지는 이번 경기의 접전을 통해 리그 강호로서의 저력을 입증했으며, 향후 경기에서도 상위권 자리 방어에 집중할 것으로 예상된다. 키움 DRX는 다음 경기부터 본격적인 재정비를 통해 하락세를 멈춰야 할 시점에 놓여있다.	{LCK,젠지,키움DRX,BO3,풀세트,5주차}	PUBLISHED	2026-05-19 11:11:47.086	2026-05-19 11:11:47.086	0
cmpcj9d6c003kaa8apmmic2qi	디플러스 기아, BNK 피어엑스 완파 2:0 승리	lck-match-115548128962840675	2026-04-30 10:00:00	lolesports	Esports	LCK	fixed	디플러스 기아, BNK 피어엑스 완파 2:0 승리	2026년 4월 30일 LCK 5주 차 경기에서 디플러스 기아가 BNK 피어엑스를 2:0으로 완파했다. 현재 디플러스 기아는 7승 7패, BNK 피어엑스는 5승 9패를 기록했다.	디플러스 기아가 30일 LCK 5주 차 경기에서 BNK 피어엑스와 BO3 대전을 펼쳐 2:0으로 셧아웃 승리를 거둬 확인됐다. 두 세트 모두 접전 끝에 승리를 따냈다.\n\n이번 승리로 디플러스 기아는 7승 7패의 동점 전적을 유지했으며, BNK 피어엑스는 5승 9패로 중위권 경쟁에서 뒤처진 상황이다. 디플러스 기아는 리그 중반부 안정적인 성적을 보이고 있으며, 이번 완파 승리는 향후 상위권 진출을 위한 중요한 발판이 될 것으로 판단된다.\n\nBNK 피어엑스는 4경기 연패를 기록하며 리그 후반부 순위 결정전을 앞두고 승리가 필수적인 상황이다. 다음 경기 결과에 따라 리그 판도가 크게 달라질 것으로 예상된다.	{LCK,"디플러스 기아","BNK 피어엑스","2:0 완파",5주차}	PUBLISHED	2026-05-19 11:11:52.308	2026-05-19 11:11:52.308	0
cmpcj9hx0003laa8a6hhhyvqp	한진 브리온, DN 수퍼스 완파...5주 차 맞수전 제압	lck-match-115548128962906227	2026-05-01 08:00:00	lolesports	Esports	LCK	fixed	한진 브리온, DN 수퍼스 완파...5주 차 맞수전 제압	2026년 5월 1일 LCK 5주 차 경기에서 한진 브리온이 DN 수퍼스를 2:0으로 완파했다. 현재 한진 브리온은 6승 8패, DN 수퍼스는 1승 13패를 기록했다.	한진 브리온이 5월 1일 LCK 5주 차 경기에서 DN 수퍼스를 상대로 2:0 완파를 거두며 승리를 신고했다. 양 팀이 맞붙은 이번 BO3 경기는 풀세트 접전 양상을 띠었으나, 최종 결과는 한진 브리온의 2세트 연승으로 결정됐다.\n\n이번 승리로 한진 브리온은 6승 8패의 전적을 기록하며 중위권 순위를 유지했다. 반면 DN 수퍼스는 1승 13패라는 현저한 전력차를 드러내며 리그 최하위 자리에서 추가 패배를 입었다. 두 팀 간의 전력 격차가 경기 결과에 그대로 반영된 것으로 확인됐다.\n\nLCK 리그는 현재 5주 차를 진행 중이며, 향후 경기 결과에 따라 순위 변동이 예상된다. 한진 브리온은 안정적인 중위권 위치를 다지기 위해 다음 경기 성과가 중요할 것으로 보인다.	{LCK,"한진 브리온","DN 수퍼스","2:0 완파","5주 차",BO3,이스포츠}	PUBLISHED	2026-05-19 11:11:58.452	2026-05-19 11:11:58.452	0
cmpcj9mqp003maa8ar1jtdfr2	한화생명 e스포츠, T1 꺾고 접전 신승…리그 선두 가점 확대	lck-match-115548128962906311	2026-05-01 10:00:00	lolesports	Esports	LCK	fixed	한화생명 e스포츠, T1 꺾고 접전 신승…리그 선두 가점 확대	5월 1일 LCK 5주차 경기에서 한화생명 e스포츠가 T1을 2:1로 꺾었다. 풀세트 접전 끝 승리한 한화생명은 12승 2패로 순위를 굳혔다.	2026년 5월 1일 LCK 5주차 경기에서 한화생명 e스포츠가 T1과의 풀세트 접전에서 2:1로 승리했다. 경기는 2세트까지 팽팽한 우위 관계를 유지하다 결정세트에서 한화생명이 한 발 빠른 판단력으로 승기를 잡으며 마무리됐다.\n\n이번 승리로 한화생명은 12승 2패의 전적을 기록해 현재 LCK 최상위권 위치를 공고히 했다. 반면 T1은 10승 4패로 기록되어 리그 내 경쟁 구도에서 한화생명과의 격차를 더욱 벌리게 됐다. 양 팀 모두 높은 수준의 경합을 펼쳤으나, 마지막 결정 순간의 추진력에서 한화생명이 우위를 점한 것으로 확인됐다.\n\n남은 경기를 통해 두 팀의 재대결 가능성과 리그 최종 순위 결정이 어떻게 전개될지 주목된다. 현재까지의 전적으로 볼 때 한화생명의 일관된 경기력이 리그 판도에 미치는 영향력이 상당한 것으로 판단된다.	{LCK,"한화생명 e스포츠",T1,"2:1 승리","풀세트 접전",5주차}	PUBLISHED	2026-05-19 11:12:04.706	2026-05-19 11:12:04.706	0
cmpcj9sim003naa8a3psm3rnh	젠지, 디플러스 기아 꺾고 풀세트 접전 끝 신승…10승 4패 선두 유지	lck-match-115548128963037523	2026-05-02 08:00:00	lolesports	Esports	LCK	fixed	젠지, 디플러스 기아 꺾고 풀세트 접전 끝 신승…10승 4패 선두 유지	5주차 2일 젠지는 디플러스 기아와의 BO3 경기에서 2:1로 승리했다. 젠지는 10승 4패로 순위를 유지하며, 패배팀 디플러스 기아는 7승 7패를 기록했다.	젠지가 2026년 5월 2일 LCK 5주차 경기에서 디플러스 기아를 2:1로 꺾었다. 풀세트 접전으로 치러진 이번 경기는 최종 세트까지 팽팽한 경쟁을 펼치다가 젠지가 마지막 세트를 제압하며 승리를 거머쥐었다.\n\n이 승리로 젠지는 10승 4패의 전적을 유지하며 리그 상위권 순위를 견고히 다졌다. 반면 디플러스 기아는 7승 7패로 동점 전적을 기록하며 중원대 팀들과의 경쟁이 심화된 상황이다. 젠지의 풀세트 승리는 팀의 저력을 입증하는 한편, 디플러스 기아에게는 상승세를 이어가기 위한 과제를 남겼다.\n\n젠지는 5주차를 2:1의 신승으로 마감하면서 리그 우승 경쟁에서의 입지를 굳혔다. 디플러스 기아는 5승대 팀들과의 경합 속에서 안정적인 성적 확보가 시급한 상황으로 보인다.	{LCK,젠지,디플러스기아,2:1승리,풀세트접전,5주차}	PUBLISHED	2026-05-19 11:12:12.191	2026-05-19 11:12:12.191	0
cmpcj9xgm003oaa8aq8fkauav	키움 DRX, 농심 레드포스 완파…셧아웃 승리로 순위 경쟁 재진입	lck-match-115548128963037559	2026-05-02 10:00:00	lolesports	Esports	LCK	fixed	키움 DRX, 농심 레드포스 완파…셧아웃 승리로 순위 경쟁 재진입	2026년 5월 2일 LCK 5주차 경기에서 키움 DRX가 농심 레드포스를 2:0으로 완파했다. 동점 상황의 두 팀 모두 4승 10패 기록을 보유하고 있으며, 이번 승리로 키움 DRX는 순위 경쟁에 탄력을 받게 됐다.	2026년 5월 2일 오전 10시(KST 기준)에 진행된 LCK 5주차 경기에서 키움 DRX는 농심 레드포스를 상대로 2:0의 완승을 거두었다. BO3 포맷의 본 경기에서 키움 DRX가 세트를 내주지 않으며 셧아웃 승리를 기록한 것으로 확인됐다.\n\n두 팀 모두 4승 10패로 동일한 전적을 보유한 상황 속에서 진행된 이번 경기는 하위권 순위 경쟁의 판도를 결정짓는 중요한 매치였다. 키움 DRX의 완파 승리는 팀의 5승 10패 기록으로의 상향 조정을 의미하며, 이는 농심 레드포스와의 직접 대면 결과를 통해 순위 경쟁에서 우위를 확보하게 됐음을 의미한다.\n\n남은 5주차 경기들과 후속 라운드에서 키움 DRX는 이번 승리의 탄력을 바탕으로 추가 승점 확보를 통해 순위 상승을 노릴 것으로 예상된다. 반면 농심 레드포스는 4승 10패 기록을 유지한 채 다음 경기에서의 재기를 도모해야 할 상황으로 평가된다.	{LCK,키움DRX,농심레드포스,2:0완파,5주차,이스포츠}	PUBLISHED	2026-05-19 11:12:18.598	2026-05-19 11:12:18.598	0
cmpcja1r7003paa8av702707n	한진 브리온, KT 롤스터 완파 2:0 셧아웃	lck-match-115548128963037511	2026-05-03 08:00:00	lolesports	Esports	LCK	fixed	한진 브리온, KT 롤스터 완파 2:0 셧아웃	5주 차 2026년 5월 3일 진행된 한진 브리온 vs KT 롤스터 경기에서 한진 브리온이 2:0으로 완승을 거두었다. 현재 한진 브리온은 6승 8패, KT 롤스터는 11승 3패를 기록하고 있다.	2026년 5월 3일 진행된 LCK 5주 차 한진 브리온과 KT 롤스터의 BO3 경기에서 한진 브리온이 2:0의 스트레이트 세트로 압도적 승리를 거두었다. 현재까지 리그 상위권 팀인 KT 롤스터(11승 3패)를 상대로 한 이번 완파는 주목할 만한 결과다.\n\n이번 승리로 한진 브리온은 6승 8패의 기록을 보유하며 리그 중위권에 머물고 있다. 반면 KT 롤스터는 이 경기 패배에도 불구하고 11승 3패로 리그 최상위권의 순위를 유지하고 있으나, 연승 기록이 단절되었을 것으로 확인된다.\n\n한진 브리온의 다음 경기와 KT 롤스터의 회복력이 리그 판도에 영향을 미칠 것으로 예상된다. 특히 한진 브리온의 상승세는 후속 경기에서 중위권 팀들 간의 순위 변동을 가져올 수 있는 변수가 될 전망이다.	{LCK,"한진 브리온","KT 롤스터","2:0 완파",5주차}	PUBLISHED	2026-05-19 11:12:24.163	2026-05-19 11:12:24.163	0
cmpcja6ez003qaa8a5bgnu0af	BNK 피어엑스, DN 수퍼스 2:0 완파…5주차 승점 확보	lck-match-115548128962971915	2026-05-03 10:00:00	lolesports	Esports	LCK	fixed	BNK 피어엑스, DN 수퍼스 2:0 완파…5주차 승점 확보	2026년 5월 3일 LCK 5주차 경기에서 BNK 피어엑스가 DN 수퍼스를 2:0으로 셧아웃, 통산 5승 9패로 기록을 정리했다.	BNK 피어엑스가 5월 3일 DN 수퍼스와의 5주차 경기에서 2:0으로 완승을 거두었다. 이번 경기는 BO3 포맷으로 진행되었으며, 양 팀이 각 세트마다 접전을 펼친 것으로 확인됐다.\n\n이 승리로 BNK 피어엑스는 통산 5승 9패의 기록을 확보했다. 반면 DN 수퍼스는 1승 13패의 성적으로 리그 최하위권에 머물러 있으며, 이번 패배 이후 연패 행진이 계속되는 상황이다. BNK 피어엑스는 이번 승리를 통해 중원대 팀들 사이에서의 입지를 다지게 된다.\n\n앞으로 BNK 피어엑스는 상위권 팀들과의 경기를 통해 순위 상승을 노릴 것으로 예상된다. 한편 DN 수퍼스는 리그 생존을 위해 다음 경기부터 즉시적인 전력 쇄신이 요구되는 상황으로, 하반기 순위 경쟁에서의 분기점을 맞이하고 있다.	{LCK,BNK피어엑스,DN수퍼스,2:0완승,5주차경기}	PUBLISHED	2026-05-19 11:12:30.203	2026-05-19 11:12:30.203	0
cmpcjaa4s003raa8a7itg0079	젠지, 농심 레드포스 완파…10승 4패로 상위권 굳히기	lck-match-115548128963037531	2026-05-06 08:00:00	lolesports	Esports	LCK	fixed	젠지, 농심 레드포스 완파…10승 4패로 상위권 굳히기	LCK 6주 차, 젠지가 농심 레드포스를 2:0으로 셧아웃. 젠지는 10승 4패로 승률을 높였고, 농심 레드포스는 4승 10패로 하위권 기록을 확정했다.	젠지가 5월 6일 LCK 6주 차 경기에서 농심 레드포스를 2:0으로 완파했다. 젠지는 BO3 포맷의 풀세트 접전 끝에 압도적인 승리를 거둬 현재 전적을 10승 4패로 올렸다.\n\n이번 승리로 젠지는 리그 내 상위권 포지션을 확실히 다졌다. 반면 농심 레드포스는 4승 10패의 전적을 기록하며 하위권 순위에서 벗어나지 못했다. 두 팀의 승수 격차는 이미 6승으로 벌어진 상황이다.\n\n젠지는 다음 경기를 통해 상위권 자리를 이어갈 것으로 예상되며, 농심 레드포스는 남은 경기에서 하위권 탈출을 위한 분발이 필요한 상황이다.	{LCK,젠지,"농심 레드포스","2:0 완파","6주 차",이스포츠}	PUBLISHED	2026-05-19 11:12:35.018	2026-05-19 11:12:35.018	0
cmpcjaebg003saa8a2wpf27ox	한화생명, DN 수퍼스 완파…6주 차 승리로 상위권 위치 굳히다	lck-match-115548128962971855	2026-05-06 10:00:00	lolesports	Esports	LCK	fixed	한화생명, DN 수퍼스 완파…6주 차 승리로 상위권 위치 굳히다	5월 6일 LCK 6주 차 경기에서 한화생명 e스포츠가 DN 수퍼스를 2:0으로 셧아웃했다. 한화생명은 12승 2패 전적을 기록하며 리그 상위권을 유지했다.	한화생명 e스포츠는 6일 오전 진행된 LCK 6주 차 경기에서 DN 수퍼스와의 BO3 매치업에서 2:0의 완승을 거두었다. 한화생명은 이번 승리로 전적을 12승 2패로 향상시켰다.\n\n현재 한화생명은 리그 상위권 위치를 확실히 하고 있으며, 이번 경기는 강팀으로서의 위상을 재확인하는 계기가 되었다. 반면 DN 수퍼스는 1승 13패의 전적으로 리그 하위권 자리에 머물러 있으며, 추후 성적 개선이 절실한 상황이다.\n\n남은 시즌을 앞두고 한화생명은 현재의 모멘텀을 이어가며 상위권 마무리를 노릴 것으로 예상된다. DN 수퍼스는 연패 탈출을 위한 전력 재정비와 전술 개선이 요구되는 상황이다.	{LCK,"한화생명 e스포츠","DN 수퍼스","6주 차","2:0 승리",이스포츠}	PUBLISHED	2026-05-19 11:12:40.444	2026-05-19 11:12:40.444	0
cmpcjaj2a003taa8atj9ulxct	KT 롤스터, 디플러스 기아 완파…6주차 승점 격차 확대	lck-match-115548128963037539	2026-05-07 08:00:00	lolesports	Esports	LCK	fixed	KT 롤스터, 디플러스 기아 완파…6주차 승점 격차 확대	2026년 5월 7일 진행된 LCK 6주차 경기에서 KT 롤스터가 디플러스 기아를 2:0으로 셧아웃, 전적 11승 3패로 리그 상위권 입지를 다졌다.	KT 롤스터는 7일 오전 LCK 6주차 정규시즌에서 디플러스 기아와의 BO3 경기에서 2:0으로 완승을 거두었다. 이로써 KT 롤스터는 11승 3패의 전적으로 리그 상단부 점유를 지속하고 있다.\n\n이번 승리는 KT 롤스터의 연승세를 이어가는 한편, 7승 7패로 현재 중위권에 위치한 디플러스 기아의 침체가 심화되는 지점이 됐다. 두 팀 사이 승수 격차는 4승으로 벌어졌으며, KT 롤스터는 리그 내 주요 경쟁팀으로서의 우위를 재확인했다.\n\n6주차 경기 결과는 시즌 후반 순위 결정의 분수령이 될 것으로 예상된다. KT 롤스터는 안정적인 경기력 유지로 플레이오프 상위 시드 확보를 노리는 한편, 디플러스 기아는 5주 남은 정규시즌에서 승률 회복의 기로에 서있다.	{LCK,KT롤스터,디플러스기아,2026시즌,6주차,경기결과}	PUBLISHED	2026-05-19 11:12:46.594	2026-05-19 11:12:46.594	0
cmpcjao3k003uaa8alxhtakj9	한진 브리온, BNK 피어엑스 2:0 완파…6주 차 승점 경쟁 가열	lck-match-115548128962971919	2026-05-07 10:00:00	lolesports	Esports	LCK	fixed	한진 브리온, BNK 피어엑스 2:0 완파…6주 차 승점 경쟁 가열	2026년 5월 7일 LCK 6주 차 경기에서 한진 브리온이 BNK 피어엑스를 2:0으로 격파했다. 브리온은 6승 8패로 기록을 상향 조정했고, 피어엑스는 5승 9패로 확인됐다.	한진 브리온이 5월 7일 LCK 6주 차 경기에서 BNK 피어엑스를 상대로 2:0 완승을 거두었다. 두 세트 모두 경합으로 진행되며 접전을 펼쳤으나 결국 브리온이 중원 장악력을 바탕으로 승리를 거머쥐었다.\n\n이번 승리로 한진 브리온은 6승 8패로 전적을 정리하며 하위권 탈출을 향한 발걸음을 재정비했다. BNK 피어엑스는 5승 9패의 기록으로 승점 경쟁에서 밀려났으며, 리그 후반전을 앞두고 안정적인 승리 확보가 과제로 지적된다. 두 팀 모두 남은 경기 운영에서 변수 관리가 중요한 시점이 도래했다.\n\n한진 브리온은 다음 주차 경기에서의 연속 승리 확보 여부가 순위 재편성의 핵심 변수가 될 전망이다. 피어엑스는 중단원의 팀 기동력 재정비를 통해 하락세 반전을 노려야 할 상황으로 분석된다.	{LCK,"한진 브리온","BNK 피어엑스","2:0 완승","6주 차",이스포츠}	PUBLISHED	2026-05-19 11:12:53.12	2026-05-19 11:12:53.12	0
cmpcjasm8003vaa8astp8acah	T1, DN 수퍼스 2:0 완파… 10승으로 선두권 공고히	lck-match-115548128962971887	2026-05-08 08:00:00	lolesports	Esports	LCK	fixed	T1, DN 수퍼스 2:0 완파… 10승으로 선두권 공고히	2026년 5월 8일 LCK 6주 차 경기에서 T1이 DN 수퍼스를 2:0으로 셧아웃하며 10승 4패 기록을 세웠다.	T1은 2026년 5월 8일(한국시간) 6주 차 경기에서 DN 수퍼스와의 BO3 대전에 나섰고, 2:0의 스트레이트 승리를 거두며 3판 모두를 승점으로 계산했다. 최종 스코어는 T1이 2승, DN 수퍼스가 0승으로 기록됐다.\n\n이번 승리로 T1은 현재까지 10승 4패의 전적을 기록하며 리그 선두권을 공고히 했다. 반면 DN 수퍼스는 1승 13패의 저조한 성적으로 하위권에 머물고 있으며, 이번 경기는 팀의 향후 순위 개선을 위한 중요한 고비가 될 것으로 보인다.\n\nT1은 현재의 선두 기록을 바탕으로 리그 중반부에 접어들며 순위 재정립이 한창인 LCK에서 강한 모습을 이어가는 중이다. DN 수퍼스는 남은 일정에서 승수를 늘려야 하는 시점에 접어들었으며, 향후 경기들이 팀의 시즌 전개에 결정적인 역할을 할 것으로 예상된다.	{LCK,T1,DN수퍼스,2:0완파,6주차,2026시즌}	PUBLISHED	2026-05-19 11:12:58.976	2026-05-19 11:12:58.976	0
cmpcjaxtd003waa8a47m7wtk1	젠지, 키움 DRX 완파…6주 차 상위권 경쟁 본격화	lck-match-115548128963037535	2026-05-08 10:00:00	lolesports	Esports	LCK	fixed	젠지, 키움 DRX 완파…6주 차 상위권 경쟁 본격화	2026년 5월 8일 LCK 6주 차 경기에서 젠지가 키움 DRX를 2:0으로 셧아웃하며 10승 4패로 상승했다. 키움 DRX는 4승 10패로 하강했다.	젠지가 2026년 5월 8일 오전 10시 진행된 LCK 6주 차 경기에서 키움 DRX를 2:0 스코어로 완파했다. BO3 풀세트 접전 끝 젠지가 승리를 거머쥐며 리그 내 강자로서의 위상을 재확인했다.\n\n이 승리로 젠지는 10승 4패의 전적으로 상승하며 리그 상위권 경쟁에서 주도권을 강화했다. 반면 키움 DRX는 4승 10패로 기록되며 리그 하위권으로 내려앉게 됐다. 젠지의 이번 승리는 현재 리그 판도에서 팀의 일관된 경쟁력을 보여주는 결과로 평가된다.\n\n6주 차 경기 결과는 각 팀의 상승세와 하강세를 명확히 드러냈다. 젠지의 다음 대전 상대와 키움 DRX의 재도약 시도가 향후 리그 순위 변동에 미칠 영향에 관심이 집중되고 있다.	{LCK,젠지,키움DRX,"2:0 완파",6주차,이스포츠}	PUBLISHED	2026-05-19 11:13:05.713	2026-05-19 11:13:05.713	0
cmpcjb34t003xaa8atfj0gvwo	BNK 피어엑스, KT 롤스터 2:0 완파…LCK 6주차 이변	lck-match-115548128962971931	2026-05-09 08:00:00	lolesports	Esports	LCK	fixed	BNK 피어엑스, KT 롤스터 2:0 완파…LCK 6주차 이변	2026년 5월 9일 LCK 6주차 경기에서 BNK 피어엑스가 11승 3패 KT 롤스터를 상대로 2:0 셧아웃을 기록했다. BO3 전 세트가 접전으로 펼쳐진 가운데 하위팀이 상위팀을 압도하며 승리를 거두었다.	BNK 피어엑스가 5월 9일 LCK 6주차 경기에서 KT 롤스터를 상대로 2:0 완승을 거두었다. 11승 3패로 상위권을 점유하던 KT 롤스터를 상대로 한 이번 경기는 각 세트가 치열한 접전으로 펼쳐졌으나, 결국 BNK 피어엑스의 팀 전술이 우위를 점했다.\n\n이번 승리로 BNK 피어엑스는 5승 10패로 기록을 개선했으며, 하위권 팀의 상위권 팀 격파는 리그 판도에 변수로 작용하게 됐다. KT 롤스터는 11승 4패로 기록이 변경되었으나, 여전히 리그 상위권 순위를 유지하고 있다.\n\nBNK 피어엑스의 이번 승리는 리그 후반부 승점 경쟁에 있어 예측 불가능한 변수임을 증명했다. 두 팀 모두 앞으로의 경기에서 리그 최종 순위 결정전에 집중해야 할 시점이다.	{LCK,"BNK 피어엑스","KT 롤스터","2:0 승리",6주차,이스포츠}	PUBLISHED	2026-05-19 11:13:12.604	2026-05-19 11:13:12.604	0
cmpcjb7gq003yaa8a8hp66d7l	한진 브리온, 농심 레드포스 완파…6주 차 승점 경쟁 가열	lck-match-115548128963037515	2026-05-09 10:00:00	lolesports	Esports	LCK	fixed	한진 브리온, 농심 레드포스 완파…6주 차 승점 경쟁 가열	LCK 6주 차 경기에서 한진 브리온이 농심 레드포스를 2:0으로 셧아웃했다. 경기는 2026년 5월 9일 진행됐으며, 브리온은 승수 6을 기록했다.	한진 브리온이 2026년 5월 9일 LCK 6주 차에서 농심 레드포스와의 BO3 경기에서 2:0으로 완파를 거두었다. 풀세트 접전 끝의 승리로 기록된 이번 경기에서 브리온은 상대를 허용 없이 연속 세트를 빼앗으며 압도적 승리를 확보했다.\n\n이번 승리로 한진 브리온은 통산 6승 8패의 전적을 기록했다. 반면 농심 레드포스는 4승 10패로 하강세를 이어가는 모습을 보였다. 브리온의 이 승리는 리그 중반 순위 경쟁에서 중요한 포인트로 작용하며, 팀의 상승 기조를 유지하는 계기가 될 것으로 판단된다.\n\n한진 브리온은 이번 승리를 발판으로 향후 경기에서 연승 가도를 이을 수 있을지 주목된다. 농심 레드포스는 4승대에 머물며 하위권 탈출을 위해 다음 일정에서 반드시 결과를 내야 할 상황이다.	{LCK,"한진 브리온","농심 레드포스","2:0 승리",6주차,이스포츠}	PUBLISHED	2026-05-19 11:13:18.218	2026-05-19 11:13:18.218	0
cmpcjbbqv003zaa8aajzoiji8	T1, 디플러스 기아 완파… 6주차 첫 경기서 10승 달성	lck-match-115548128962971899	2026-05-10 08:00:00	lolesports	Esports	LCK	fixed	T1, 디플러스 기아 완파… 6주차 첫 경기서 10승 달성	2026년 5월 10일 LCK 6주차, T1이 디플러스 기아를 2:0으로 셧아웃하며 10승 4패 기록을 수립했다.	T1은 10일 오전 8시(UTC 기준) LCK 6주차 첫 경기에서 디플러스 기아와의 BO3 매치업에 나서 2:0 완승으로 확정했다. 풀세트 접전의 경과를 거쳤음에도 불구하고 T1은 집중력을 유지하며 연속된 세트를 장악했다.\n\n이번 승리로 T1의 전적은 10승 4패로 올라섰으며, 승수 기준 리그 상위권 위치를 공고히 했다. 반면 디플러스 기아는 7승 7패로 기록되어 승패가 동일해진 가운데, 향후 상승세와 하강세를 결정하는 중요한 국면에 놓여 있다.\n\nT1은 안정적인 팀 운영으로 리그 후반부 경쟁력을 강화 중이며, 디플러스 기아는 이번 패배를 기점으로 연승으로 탈출하는 기로에서 다음 대전을 맞이하게 될 것으로 예상된다.	{LCK,T1,"디플러스 기아","2:0 완파",6주차,이스포츠}	PUBLISHED	2026-05-19 11:13:23.768	2026-05-19 11:13:23.768	0
cmpcjbgmh0040aa8a801pxpit	한화생생 e스포츠, 키움 DRX 접전 끝 신승… 12승 2패로 상위권 유지	lck-match-115548128962971879	2026-05-10 10:00:00	lolesports	Esports	LCK	fixed	한화생생 e스포츠, 키움 DRX 접전 끝 신승… 12승 2패로 상위권 유지	2026년 5월 10일 LCK 6주 차, 한화생명 e스포츠가 키움 DRX와의 BO3 풀세트 접전을 2:1로 제압했다. 한화생명은 12승 2패 전적으로 리그 상위권 입지를 다지고 있다.	한화생명 e스포츠가 10일 오전 10시 진행된 LCK 6주 차 경기에서 키움 DRX를 2:1로 꺾었다. 풀세트까지 이어진 접전 끝에 거둔 승리로, 한화생명은 현재 12승 2패의 우수한 전적을 기록 중이다.\n\n이번 승리는 한화생명의 리그 상위권 입지를 한층 공고히 하는 결과다. 반면 키움 DRX는 4승 10패로 하위권 전적을 면치 못하고 있으며, 이번 패배로 승수 증가에 어려움을 겪고 있는 상황이다. 풀세트 접전이라는 점에서 한화생명이 충분한 저력을 발휘하며 상대를 압박했음을 시사한다.\n\n한화생명은 현재의 탄탄한 성적을 바탕으로 플레이오프 진출을 향한 주도권을 유지할 것으로 예상된다. 반면 키움 DRX는 남은 경기에서의 분발이 절실한 상황으로, 하위권 탈출을 위한 연승 가도 구축이 과제로 남아있다.	{LCK,"한화생명 e스포츠","키움 DRX","2:1 승리",BO3,"풀세트 접전","6주 차"}	PUBLISHED	2026-05-19 11:13:30.089	2026-05-19 11:13:30.089	0
cmpcjbk4i0041aa8a2oyzu3lf	T1, 농심 레드포스 완파…10승 4패로 선두 유지	lck-match-115548128962971907	2026-05-13 08:00:00	lolesports	Esports	LCK	fixed	T1, 농심 레드포스 완파…10승 4패로 선두 유지	2026년 5월 13일 LCK 7주 차 경기에서 T1이 농심 레드포스를 2:0으로 셧아웃, 현재 10승 4패 기록으로 리그 선두를 이어가고 있다.	T1이 2026년 5월 13일 LCK 7주 차 경기에서 농심 레드포스를 상대로 2:0 완승을 거두었다. 풀세트 접전으로 기록된 이번 경기에서 T1은 두 세트를 연달아 장악하며 압도적인 승리를 확정지었다.\n\n이 승리로 T1은 10승 4패의 전적을 기록했으며, 리그 상위권 순위를 계속 유지하고 있다. 한편 농심 레드포스는 4승 10패의 성적으로 리그 하위권 위치에서 벗어나지 못하고 있는 상황이다.\n\nT1은 이번 승리를 발판으로 리그 후반전의 경쟁력을 더욱 강화하고 있다. 농심 레드포스는 다음 경기에서의 분발이 필요한 시점이다.	{LCK,T1,"농심 레드포스","2:0 승리","7주 차"}	PUBLISHED	2026-05-19 11:13:34.626	2026-05-19 11:13:34.626	0
cmpcjbov80042aa8a4q7l671o	디플러스 기아, DN 수퍼스 완파…7주 차 중원 다툼 승리	lck-match-115548128962971951	2026-05-13 10:00:00	lolesports	Esports	LCK	fixed	디플러스 기아, DN 수퍼스 완파…7주 차 중원 다툼 승리	13일 오전 10시 LCK 7주 차 경기에서 디플러스 기아가 DN 수퍼스를 2:0으로 셧아웃, 7승 7패 동률 유지. DN 수퍼스는 1승 13패로 리그 하위 그룹 고착.	LCK 2026 시즌 7주 차, 디플러스 기아가 DN 수퍼스를 상대로 2:0 완승을 거뒀다. 13일 오전 10시 진행된 이번 경기에서 디플러스 기아는 풀세트 접전을 제압, 승리 세트를 가져가며 리그 중원을 점하는 팀의 면모를 드러냈다.\n\n이번 승리로 디플러스 기아는 7승 7패의 동률 전적을 유지하며 리그 중단 위치를 확보했다. 반면 DN 수퍼스는 1승 13패로 기록되며 리그 하위권에 고착된 상태다. 디플러스 기아는 최근 경기를 통해 안정적인 승점 확보 흐름을 이어가는 중으로 평가된다.\n\n남은 시즌을 통해 디플러스 기아의 상승세가 리그 상위권 진출로 이어질지, DN 수퍼스가 연패 구조를 탈출할 수 있을지가 후반전의 관전 포인트가 될 전망이다.	{LCK,"디플러스 기아","DN 수퍼스","7주 차","2:0 셧아웃"}	PUBLISHED	2026-05-19 11:13:40.772	2026-05-19 11:13:40.772	0
cmpcjbtdc0043aa8alox38sht	젠지, BNK 피어엑스 완파…7주 차 연승 가도	lck-match-115548128962971923	2026-05-14 08:00:00	lolesports	Esports	LCK	fixed	젠지, BNK 피어엑스 완파…7주 차 연승 가도	LCK 7주 차 경기에서 젠지가 BNK 피어엑스를 2:0으로 셧아웃. 젠지는 10승 4패로 상위권 자리 공고히 하는 반면, BNK 피어엑스는 5승 9패 기록을 남겼다.	젠지가 BNK 피어엑스를 상대로 2:0 완패를 거두며 강한 경기력을 입증했다. 5월 14일 LCK 7주 차 경기에서 펼쳐진 이번 매치는 풀세트 접전으로 진행됐으나 최종 승자는 젠지로 확정됐다.\n\n이 승리로 젠지는 현재 10승 4패의 기록을 세우며 리그 상위권 자리를 더욱 견고히 했다. 반면 BNK 피어엑스는 5승 9패의 전적을 기록하며 하위권 순위에 머물렀다. 젠지의 연속 승리는 팀의 일관된 경기력과 안정적인 운영을 반영하는 것으로 분석된다.\n\n앞으로 젠지는 상위권 팀들과의 경쟁을 통해 순위를 더 높여나갈 것으로 예상된다. BNK 피어엑스는 현재의 부진에서 벗어나기 위해 전술과 팀 운영 개선이 시급한 상황이다.	{LCK,젠지,BNK피어엑스,7주차,2:0,셧아웃}	PUBLISHED	2026-05-19 11:13:46.608	2026-05-19 11:13:46.608	0
cmpcjbyi10044aa8ay8f2793a	KT 롤스터, 키움 DRX 상대 풀세트 접전 끝 신승	lck-match-115548128963037555	2026-05-14 10:00:00	lolesports	Esports	LCK	fixed	KT 롤스터, 키움 DRX 상대 풀세트 접전 끝 신승	5월 14일 7주 차 경기에서 KT 롤스터가 키움 DRX를 2:1로 꺾었다. 양 팀의 치열한 접전 끝에 KT가 풀세트를 제압하며 11승 3패로 상위권 위치를 공고히 했다.	KT 롤스터는 5월 14일 진행된 LCK 7주 차 정규시즌에서 키움 DRX와의 BO3 경기를 2:1로 승리했다. 양 팀이 펼친 풀세트 접전 끝에 KT가 최종 승자로 등극했으며, 이는 경기의 기술적 완성도와 양 진영의 높은 집중력이 돋보인 경기로 평가된다.\n\n이번 승리로 KT 롤스터는 11승 3패의 전적을 기록하며 리그 상위권 포지션을 유지했다. 풀세트까지 간 접전을 제압한 만큼 팀의 압박 상황 대응 능력과 게임 매니지먼트 능력이 입증된 것으로 보인다. 반면 키움 DRX는 4승 10패로 리그 하위권에 머물렀으나, 이번 경기에서 상위팀과의 치열한 접전을 통해 경쟁력을 보여주었다.\n\nKT 롤스터는 안정적인 성적으로 플레이오프 진출 기대감을 높이고 있으며, 남은 정규시즌에서의 연승 가도 지속이 주목된다. 키움 DRX는 하위권 탈출을 위해 다음 경기들에서의 승리 적립이 절실한 상황이다.	{LCK,"KT 롤스터","키움 DRX","2:1 신승","풀세트 접전","7주 차"}	PUBLISHED	2026-05-19 11:13:53.257	2026-05-19 11:13:53.257	0
cmpcjc32n0045aa8a4zgi2s89	한화생명 e스포츠, 디플러스 기아 완파…7주차 우위 강화	lck-match-115548128962971867	2026-05-15 08:00:00	lolesports	Esports	LCK	fixed	한화생명 e스포츠, 디플러스 기아 완파…7주차 우위 강화	5월 15일 LCK 7주차 경기에서 한화생명 e스포츠가 디플러스 기아를 2:0으로 격파했다. 한화생명은 12승 2패 최고 기록을 유지하며 리그 우위를 확보한 반면, 디플러스 기아는 7승 7패 중원대로 물러났다.	LCK 7주차 경기가 15일 진행된 가운데, 한화생명 e스포츠가 디플러스 기아와의 BO3 매치업에서 2:0 셧아웃으로 확인됐다. 최종 스코어는 2:0이며, 두 세트 모두 접전 끝 한화생명의 승리로 기록됐다.\n\n이번 승리로 한화생명 e스포츠는 12승 2패 기록을 바탕으로 리그 최상위권 위치를 공고히 했다. 반면 디플러스 기아는 7승 7패 동등한 전적을 기록하며 리그 중원대에서 밀려나는 상황이다. 한화생명의 연승 기세가 계속되는 가운데 리그 판도에서의 우위가 더욱 뚜렷해지고 있다.\n\n한화생명 e스포츠는 이어지는 경기들에서도 현재의 높은 승률을 유지할 수 있을지가 주목되는 가운데, 디플러스 기아는 중원대 진입 이후 재도약을 위한 경기력 개선이 시급한 상황이다.	{LCK,"한화생명 e스포츠","디플러스 기아","2:0 승리",7주차,이스포츠}	PUBLISHED	2026-05-19 11:13:59.183	2026-05-19 11:13:59.183	0
cmpcjc73i0046aa8aebri921s	한진 브리온, DN 수퍼스 2:0 완파…7주 차 연승 가도	lck-match-115548128962971943	2026-05-15 10:00:00	lolesports	Esports	LCK	fixed	한진 브리온, DN 수퍼스 2:0 완파…7주 차 연승 가도	2026년 5월 15일 LCK 7주 차에서 한진 브리온이 DN 수퍼스를 2:0으로 셧아웃했다. 한진 브리온은 6승 8패로 기록을 개선했고, DN 수퍼스는 1승 13패로 리그 최하위에 머물렀다.	한진 브리온이 2026년 5월 15일 LCK 7주 차 경기에서 DN 수퍼스를 상대로 2:0의 완벽한 승리를 거두었다. 이번 경기는 풀세트 접전으로 기록되며, 한진 브리온은 최종 6승 8패의 전적을 기록했다.\n\n한진 브리온의 이번 승리는 팀의 상승세를 보여주는 결과로 평가된다. 반면 DN 수퍼스는 1승 13패의 성적으로 현재 LCK 리그에서 최악의 전적을 유지하고 있으며, 리그 재정 및 전력 강화가 시급한 상황으로 확인됐다.\n\n한진 브리온은 다음 경기를 통해 상위권 팀들과의 경쟁에서 입지를 강화할 기회를 맞게 되며, DN 수퍼스는 패배의 악순환에서 벗어나기 위한 구조적 개선이 요구되고 있다.	{LCK,"한진 브리온","DN 수퍼스","2:0 완파",7주차,이스포츠}	PUBLISHED	2026-05-19 11:14:04.398	2026-05-19 11:14:04.398	0
cmpcjccbs0047aa8ai3erbb6a	T1, 젠지 꺾고 풀세트 접전 신승…동점 상황서 우위 선점	lck-match-115548128962971895	2026-05-16 08:00:00	lolesports	Esports	LCK	fixed	T1, 젠지 꺾고 풀세트 접전 신승…동점 상황서 우위 선점	2026년 5월 16일 LCK 7주 차, T1이 젠지를 2:1로 꺾고 11승 4패로 올라섰다. 동일한 전적을 기록 중인 두 팀의 풀세트 접전은 상위권 경쟁 구도를 재편하는 계기가 됐다.	2026년 5월 16일 오전 8시, LCK 7주 차 경기에서 T1이 젠지와의 풀세트 접전을 2:1로 제압했다. 경기 시작 당시 양 팀 모두 10승 4패의 동일한 전적을 기록 중이었으나, T1의 역전승으로 우승 후보 간의 체감 순위에 변화가 생겼다.\n\n이번 승리로 T1은 11승 4패의 전적으로 올라섰으며, 젠지는 10승 5패로 기록됐다. 두 팀이 현재까지 리그를 주도하고 있는 가운데 이번 직접 대면에서의 패배는 젠지의 최종 순위 결정에 중요한 변수로 작용할 가능성이 있다. 풀세트 접전이라는 높은 수준의 경쟁 구도는 리그 전반의 경합도가 상승하고 있음을 시사한다.\n\nT1은 상위권 팀들과의 경쟁에서 우위를 확보한 반면, 젠지는 추가 손실을 최소화하기 위해 남은 일정에서의 집중력 강화가 요구된다. 양 팀의 향후 일정 결과에 따라 리그 최종 판도가 결정될 것으로 전망된다.	{LCK,T1,젠지,2:1,"풀세트 접전",7주차,2026시즌}	PUBLISHED	2026-05-19 11:14:11.176	2026-05-19 11:14:11.176	0
cmpcjch3x0048aa8a6jvnoxsv	BNK 피어엑스, 농심 레드포스 완파 2:0 승리…7주차 경기에서 접전 끝 신승	lck-match-115548128962971935	2026-05-16 10:00:00	lolesports	Esports	LCK	fixed	BNK 피어엑스, 농심 레드포스 완파 2:0 승리…7주차 경기에서 접전 끝 신승	2026년 5월 16일 LCK 7주차 경기에서 BNK 피어엑스가 농심 레드포스를 2:0으로 완파했다. 두 팀 모두 세트마다 치열한 공방을 펼쳤으나 BNK 피어엑스가 접전을 제압했다.	BNK 피어엑스가 2026년 5월 16일 진행된 LCK 7주차 정규리그에서 농심 레드포스와의 경기에서 2:0으로 셧아웃 승리를 거두었다. 경기는 한국시간 오후 7시에 진행되었으며, BO3 포맷에서 BNK 피어엑스가 두 세트를 연속으로 확보하며 승리를 확정했다.\n\n이번 승리로 BNK 피어엑스는 5승 9패의 전적을 기록하게 되었다. 접전으로 평가되는 경기였으나 BNK 피어엑스가 승리를 가져가면서 리그에서 점진적으로 승수를 쌓아가고 있다. 한편 농심 레드포스는 4승 10패로 현재 리그 내 하위권 전적에 머물러 있으며, 승점 확보의 중요성이 더욱 커지는 시점이다.\n\nBNK 피어엑스는 리그 후반으로 향하면서 안정적인 경기력 유지가 필수 과제다. 농심 레드포스는 잠실실의 접전에서의 패배를 기록하며 향후 경기에서 재도약의 기회를 모색해야 할 것으로 보인다.	{LCK,BNK피어엑스,농심레드포스,2:0완파,7주차,정규리그}	PUBLISHED	2026-05-19 11:14:17.374	2026-05-19 11:14:17.374	0
cmpcjcma70049aa8ar984f5k4	KT 롤스터, 한화생명과 풀세트 접전 끝 신승 - 리그 상황 재편	lck-match-115548128962971871	2026-05-17 08:00:00	lolesports	Esports	LCK	fixed	KT 롤스터, 한화생명과 풀세트 접전 끝 신승 - 리그 상황 재편	7주 차 5월 17일 KT 롤스터가 한화생명 e스포츠와의 BO3에서 2:1로 역전 승리를 거두며 11승 3패 기록을 수립했다.	KT 롤스터는 17일 한화생명 e스포츠와의 7주 차 경기에서 풀세트 접전 끝 2:1 신승을 거두었다. 경기는 KT의 선제 실리를 내준 이후 연이은 세트 승리로 결정되는 양상을 보였으며, 최종 스코어는 2:1로 마무리됐다.\n\nこの승리로 KT 롤스터는 11승 3패의 전적을 기록하며 리그 내 상위권 경쟁 집단에 이름을 올렸다. 한편 12승 2패로 선행하던 한화생명 e스포츠는 이 경기에서의 패배로 승률 면에서 경쟁팀들과의 격차 재편이 예상된다. 양 팀 모두 리그 후반부를 향해 탄력을 받거나 태세를 재정비해야 할 상황이 됐다.\n\n리그는 7주 차를 거치며 상위권 팀들 간의 승수 차 경쟁이 본격화되는 양상을 띠고 있다. KT 롤스터의 이번 신승은 중원대 경합 집단 내에서의 실질적 순위 변화를 초래할 것으로 예상되며, 향후 리그 판도는 주요 직결 경기들의 귀추에 따라 결정될 전망이다.	{LCK,KT롤스터,한화생명,2:1,풀세트,7주차}	PUBLISHED	2026-05-19 11:14:24.079	2026-05-19 11:14:24.079	0
cmpcjcqxe004aaa8a3i72tdng	키움 DRX, 한진 브리온 2:1 완승…풀세트 접전 끝 신승	lck-match-115548128963037519	2026-05-17 10:00:00	lolesports	Esports	LCK	fixed	키움 DRX, 한진 브리온 2:1 완승…풀세트 접전 끝 신승	7주 차 5월 17일 진행된 키움 DRX와 한진 브리온의 BO3 경기에서 키움 DRX가 2:1로 역전승을 거두며 4승 10패 기록을 달성했다.	5월 17일 오전 10시에 진행된 LCK 7주 차 정규 리그 경기에서 키움 DRX가 한진 브리온을 2:1의 스코어로 누르고 승리했다. 풀세트까지 진행된 접전 속에서 키움 DRX가 최종 세트를 제압하며 필승의 심리전을 제압한 것으로 확인됐다.\n\n이번 승리로 키움 DRX는 시즌 4승 10패의 기록을 거두며 하위권 팀으로서 순위 경쟁 국면에 진입했다. 한진 브리온은 이날 패배로 6승 8패에 머물렀으나, 여전히 승수에서 앞선 입장을 유지하고 있다. 풀세트 경기에서의 패배는 팀의 심리적 모멘텀에 영향을 미칠 것으로 예상된다.\n\n양 팀 모두 시즌 후반부 순위 다툼이 심화되는 가운데, 키움 DRX의 이번 신승은 상위권 진입의 발판이 될 수 있을 것으로 전망된다. 한진 브리온은 다음 경기에서 패배의 여파를 극복하고 연승 기회를 모색해야 할 시점이다.	{LCK,키움DRX,한진브리온,BO3,7주차,접전,이스포츠}	PUBLISHED	2026-05-19 11:14:30.099	2026-05-19 11:14:30.099	0
\.


--
-- Data for Name: news_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news_categories (id, main_category, name, keywords, excludes, is_active, "order", created_at, updated_at) FROM stdin;
cmovlnuh40004kwyx7cwcltgp	PC	리그오브레전드	{리그오브레전드,롤,lol,롤드컵,라이엇,"league of legends",2xko}	{}	t	1	2026-05-07 14:47:02.153	2026-05-07 14:47:02.153
cmovlnuh70005kwyx8op7ojl2	PC	발로란트	{발로란트,valorant}	{}	t	2	2026-05-07 14:47:02.155	2026-05-07 14:47:02.155
cmovlnuh80006kwyxamxqg01z	PC	오버워치	{오버워치,overwatch}	{"오버워치 리그","overwatch league"}	t	3	2026-05-07 14:47:02.156	2026-05-07 14:47:02.156
cmovlnuh80007kwyxypxfxmhy	PC	배틀그라운드	{배틀그라운드,pubg,battlegrounds}	{모바일,mobile}	t	4	2026-05-07 14:47:02.157	2026-05-07 14:47:02.157
cmovlnuh90008kwyxismn8aiq	PC	로스트아크	{로스트아크,"lost ark"}	{}	t	5	2026-05-07 14:47:02.157	2026-05-07 14:47:02.157
cmovlnuha0009kwyxgfv1b275	PC	메이플스토리	{메이플스토리}	{메이플스토리m,메이플스토리M}	t	6	2026-05-07 14:47:02.158	2026-05-07 14:47:02.158
cmovlnuhb000akwyx7c3dx22z	PC	던전앤파이터	{던전앤파이터,던파,dnf,"dungeon fighter"}	{}	t	7	2026-05-07 14:47:02.159	2026-05-07 14:47:02.159
cmovlnuhb000bkwyxorjld6fq	PC	디아블로	{디아블로,diablo}	{}	t	8	2026-05-07 14:47:02.16	2026-05-07 14:47:02.16
cmovlnuhc000ckwyxo08siz5w	PC	붉은사막	{붉은사막}	{}	t	9	2026-05-07 14:47:02.16	2026-05-07 14:47:02.16
cmovlnuhc000dkwyx2n20he0k	Mobile	원신	{원신,genshin}	{}	t	1	2026-05-07 14:47:02.161	2026-05-07 14:47:02.161
cmovlnuhd000ekwyx2ze0pk5y	Mobile	붕괴: 스타레일	{"붕괴: 스타레일",스타레일,"honkai star rail","star rail"}	{}	t	2	2026-05-07 14:47:02.161	2026-05-07 14:47:02.161
cmovlnuhd000fkwyxdriwdp2h	Mobile	워스텔링	{워스텔링,"wuthering waves"}	{}	t	3	2026-05-07 14:47:02.162	2026-05-07 14:47:02.162
cmovlnuhe000gkwyxwtqp0u8k	Mobile	배틀그라운드 모바일	{"배틀그라운드 모바일","pubg mobile","배그 모바일"}	{}	t	4	2026-05-07 14:47:02.163	2026-05-07 14:47:02.163
cmovlnuhf000hkwyxshpooz44	Mobile	리니지M	{리니지m,리니지M,"lineage m"}	{}	t	5	2026-05-07 14:47:02.163	2026-05-07 14:47:02.163
cmovlnuhf000ikwyxovojmjbd	Mobile	나혼자만레벨업	{나혼자만레벨업,나혼렙,"solo leveling arise"}	{}	t	6	2026-05-07 14:47:02.164	2026-05-07 14:47:02.164
cmovlnuhg000jkwyxgttlixq4	Mobile	메이플스토리M	{메이플스토리m,메이플스토리M}	{}	t	7	2026-05-07 14:47:02.164	2026-05-07 14:47:02.164
cmovlnuhg000kkwyxhencfe1j	Mobile	승리의 여신: 니케	{니케,nikke,"승리의 여신: 니케"}	{}	t	8	2026-05-07 14:47:02.165	2026-05-07 14:47:02.165
cmovlnuhh000lkwyxmjfr2ys0	Console	PlayStation	{플레이스테이션,playstation,ps5,ps4,소니,sony}	{}	t	1	2026-05-07 14:47:02.165	2026-05-07 14:47:02.165
cmovlnuhh000mkwyxrt0ba2tm	Console	Xbox	{엑스박스,xbox,마이크로소프트,microsoft,게임패스,"game pass"}	{}	t	2	2026-05-07 14:47:02.166	2026-05-07 14:47:02.166
cmovlnuhi000nkwyxue10kaqk	Console	Nintendo	{닌텐도,nintendo,스위치,switch,ns2}	{}	t	3	2026-05-07 14:47:02.166	2026-05-07 14:47:02.166
cmovlnuhi000okwyxp701zoa6	Esports	LCK	{lck,t1,젠지,gen.g,kt롤스터,디플러스기아,한화생명,농심레드포스}	{}	t	1	2026-05-07 14:47:02.167	2026-05-07 14:47:02.167
cmovlnuhj000pkwyxch7h0lbs	Esports	VCT	{vct,"valorant champions"}	{}	t	2	2026-05-07 14:47:02.168	2026-05-07 14:47:02.168
\.


--
-- Data for Name: news_recommends; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news_recommends (id, created_at, user_id, news_id) FROM stdin;
\.


--
-- Data for Name: news_sources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news_sources (id, name, url, language, platform, is_active, last_fetch_at, last_count, created_at) FROM stdin;
cmovlnuh00001kwyxm8px9ro6	Push Square	https://www.pushsquare.com/feeds/latest	en	PlayStation	t	\N	0	2026-05-07 14:47:02.149
cmovlnuh20002kwyx5j0plzjv	Pure Xbox	https://www.purexbox.com/feeds/latest	en	Xbox	t	\N	0	2026-05-07 14:47:02.15
cmovlnuh30003kwyxv2ol36bz	Nintendo Life	https://www.nintendolife.com/feeds/latest	en	Nintendo	t	\N	0	2026-05-07 14:47:02.151
cmovlnufw0000kwyxgy89gbm9	게임메카	https://www.gamemeca.com/rss.php	ko	\N	t	\N	0	2026-05-07 14:47:02.093
05cc803d-43a3-42d6-9629-2cd161289814	lolesports	https://esports-api.lolesports.com/persisted/gw	en	Esports	t	\N	0	2026-05-08 02:33:45.355
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (id, email, code, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: pipeline_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pipeline_logs (id, status, message, saved_count, skipped_count, failed_count, run_at) FROM stdin;
cmpcjcrbp004baa8anubrdrls	warning	수동 실행 완료 — saved: 103, skipped: 0, failed: 2	103	0	2	2026-05-19 11:14:30.613
\.


--
-- Data for Name: post_likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_likes (id, post_id, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: post_recommends; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_recommends (id, created_at, user_id, post_id) FROM stdin;
2	2026-04-30 05:55:05.991	847b6119-ff05-431d-a84b-7eff40629579	1
5	2026-05-10 18:32:23.833	847b6119-ff05-431d-a84b-7eff40629579	2
6	2026-05-17 00:26:35.44	a253dfa6-87b2-4627-9e3f-b179c9f1100a	2
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, title, content, view_count, author_id, category_id, created_at, updated_at, deleted_at, images, status) FROM stdin;
2	테스트	ㅎㅇㅎㅇㅎ<img src="https://pub-49c6917413ba4a2a8195975b5928be90.r2.dev/posts/847b6119-ff05-431d-a84b-7eff40629579/433f9331-9ec8-4072-9cb3-ad6baa5673da.png" alt="업로드 이미지" class="max-w-full h-auto rounded my-2"><br>	10	847b6119-ff05-431d-a84b-7eff40629579	5	2026-04-30 05:55:41.412	2026-05-19 09:01:44.124	\N	{}	PUBLISHED
1	플레이스테이션 사요	플레이스테이션 가격 얼마에요 보통 ?<img src="https://pub-49c6917413ba4a2a8195975b5928be90.r2.dev/posts/847b6119-ff05-431d-a84b-7eff40629579/1bb9797b-99ab-4ac1-a290-4f6ce57d94d1.jpg" alt="업로드 이미지" class="max-w-full h-auto rounded my-2"><br>	7	847b6119-ff05-431d-a84b-7eff40629579	24	2026-04-25 06:18:57.828	2026-05-19 10:24:23.541	\N	{}	PUBLISHED
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, user_id, token_hash, expires_at, created_at) FROM stdin;
cmoyhl4x70001ya6vkvwrkg8n	847b6119-ff05-431d-a84b-7eff40629579	812a31dc237483c29b544059ce08b6875503ec6ec56450388868fb35f708a96f	2026-06-08 15:16:15.787	2026-05-09 15:16:15.787
cmp03xwqi00014eeydepudp22	847b6119-ff05-431d-a84b-7eff40629579	add0223321a9c5561545abef89d7ea97840ab4ad8bd30bf4231e3c66a165d442	2026-06-09 18:29:49.414	2026-05-10 18:29:49.414
cmp03y4gl00034eey546msio6	847b6119-ff05-431d-a84b-7eff40629579	2e249b8f2c7f01ee4c36f0bdb90299065a1ded7d5542f809d105cfca335a224b	2026-06-09 18:29:59.445	2026-05-10 18:29:59.445
cmp03z19000054eeyl6eknbn3	847b6119-ff05-431d-a84b-7eff40629579	4eb6dd4c31a177f9ad9a13e5dedd83037e9e0801a54ee142c4fd4527447d1998	2026-06-09 18:30:41.94	2026-05-10 18:30:41.94
cmp0zahro0001kasv49prg7dz	847b6119-ff05-431d-a84b-7eff40629579	75d9ca2baceafa5955489c2096217825c591838bf23946b0ca10ebfe1c69f694	2026-06-10 09:07:24.65	2026-05-11 09:07:24.651
cmp6j33af0001ou43dhx00oyx	847b6119-ff05-431d-a84b-7eff40629579	3e58cd863c00dff00752a630e83151929e4700db577495f33364897c80f92939	2026-06-14 06:20:22.502	2026-05-15 06:20:22.503
cmp91ulhp0003jv8x1afvmop9	a253dfa6-87b2-4627-9e3f-b179c9f1100a	cff900f0747e1dba560c1a1ed7c097e5cfd2af320e4a37e71b1b1a43f1392368	2026-06-16 00:41:11.229	2026-05-17 00:41:11.23
cmp91uvaj0005jv8x1il99yb2	847b6119-ff05-431d-a84b-7eff40629579	8378865a3337429c7fcfed84c1e89fbdcf6af8925067e5c5855c9d8b95025a00	2026-06-16 00:41:23.947	2026-05-17 00:41:23.948
cmpchvnki0001k8b7kk6j5ysi	847b6119-ff05-431d-a84b-7eff40629579	97b6660bf44d04a1539b259b57e32b014e81aec696a90c5d5631ee3612a22254	2026-06-18 10:33:12.893	2026-05-19 10:33:12.894
cmpchvuh60007k8b7kq96rhkc	847b6119-ff05-431d-a84b-7eff40629579	05969996c5aec83da520f71a759e5fedb0ac620fe43cf1bdd225322a1cdcd6bc	2026-06-18 10:33:21.93	2026-05-19 10:33:21.931
cmpcsl4x0004taa8awnepvk34	847b6119-ff05-431d-a84b-7eff40629579	c2e8c86dd70318ac9126041c041b314e37f8f684e4f7034927fa5ba54ced3ccb	2026-06-18 15:32:57.923	2026-05-19 15:32:57.936
cmpctziyl0051aa8ajgzv8q0d	847b6119-ff05-431d-a84b-7eff40629579	89478de12098fb6bd107442326d34b4ba65674c456f41913c8f10b807428b091	2026-06-18 16:12:09.021	2026-05-19 16:12:09.022
cmpde3cst0001xbmanj3vmp0e	bf721f4f-66c9-47ae-8f38-2163eff75ead	0ef15b67700bd4d7bce0df182c35ae70d1815a7c4779933d7fe26a6f4f3e67db	2026-06-19 01:34:59.978	2026-05-20 01:34:59.979
cmpde3hmp0003xbmabimeumif	bf721f4f-66c9-47ae-8f38-2163eff75ead	197120d2e66cc39e29b78cc94b581dedf93cebc3c1fd9ebff383c17236b74c51	2026-06-19 01:35:06.241	2026-05-20 01:35:06.241
cmpde8obf0005xbma58jd21nn	bf721f4f-66c9-47ae-8f38-2163eff75ead	ae76bb702834abbdfa07fc2e6195c59163dd136bf437eea1693166a7d3cef2f4	2026-06-19 01:39:08.145	2026-05-20 01:39:08.145
cmpdeoe080007k90aq50o30a0	bf721f4f-66c9-47ae-8f38-2163eff75ead	44654e601dfe220fb3ad64a293cd5189e75820f85c85517c33bba0b5d59e9eca	2026-06-19 01:51:21.32	2026-05-20 01:51:21.321
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reports (id, type, target_id, reason, status, reporter_id, created_at, updated_at) FROM stdin;
3	COMMENT	6	시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요시끄러워요	RESOLVED	a253dfa6-87b2-4627-9e3f-b179c9f1100a	2026-05-17 00:42:32.758	2026-05-17 00:54:28.186
2	COMMENT	4	아니 ㅇㅁ나ㅣㄴ머인머ㅏㅇ아니 ㅇㅁ나ㅣㄴ머인머ㅏㅇ아니 ㅇㅁ나ㅣㄴ머인머ㅏㅇ아니 ㅇㅁ나ㅣㄴ머인머ㅏㅇ아니 ㅇㅁ나ㅣㄴ머인머ㅏㅇ아니 ㅇㅁ나ㅣㄴ머인머ㅏㅇ아니 ㅇㅁ나ㅣㄴ머인머ㅏㅇ아니 ㅇㅁ나ㅣㄴ머인머ㅏㅇ아니 ㅇㅁ나ㅣㄴ머인머ㅏㅇ아니 ㅇㅁ나ㅣㄴ머인머ㅏㅇ아니 ㅇㅁ나ㅣㄴ머인머ㅏㅇ아니 ㅇㅁ나ㅣㄴ머인머ㅏㅇ아니 ㅇㅁ나ㅣㄴ머인머ㅏㅇ아니 ㅇㅁ나ㅣㄴ머인머ㅏㅇ아니 ㅇㅁ나ㅣㄴ머인머ㅏㅇ아니 ㅇㅁ	REJECTED	a253dfa6-87b2-4627-9e3f-b179c9f1100a	2026-05-17 00:40:00.494	2026-05-17 00:55:02.841
1	COMMENT	2	ㄴ	RESOLVED	a253dfa6-87b2-4627-9e3f-b179c9f1100a	2026-05-17 00:38:06.425	2026-05-17 00:55:07.39
\.


--
-- Data for Name: system_configs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_configs (key, value, updated_at) FROM stdin;
pipeline_paused	false	2026-05-19 16:07:57.901
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, nickname, profile_image, role, provider, created_at, updated_at, ban_reason, banned_until, is_banned, last_login_at) FROM stdin;
847b6119-ff05-431d-a84b-7eff40629579	tjdalsquf8@naver.com	$2b$12$UXmz9V3Z8ANI6HWWRjC0G.xslLJFhUTFBk2SWDM4Uq7NgrXM3/sJW	성민이	https://pub-49c6917413ba4a2a8195975b5928be90.r2.dev/profiles/847b6119-ff05-431d-a84b-7eff40629579/1b6b6cad-ee72-47c2-a55b-fd66a942e01d.png	ADMIN	EMAIL	2026-04-09 06:54:14.229	2026-05-19 15:33:05.781	\N	\N	f	2026-05-19 15:33:05.78
bf721f4f-66c9-47ae-8f38-2163eff75ead	tjdalsquf23@gmail.com	\N	조성민	https://lh3.googleusercontent.com/a/ACg8ocLV2P3b1xj6Ylpvp7pvXVyku8LgB2cbacBP6NhYjLdPhXZWbhU=s96-c	USER	GOOGLE	2026-05-20 01:34:59.906	2026-05-20 01:51:18.437	\N	\N	f	2026-05-20 01:51:18.436
768d2f37-7e65-4622-a6d0-6482e6469d06	testuser2@test.com	$2b$10$d3/H251dtDU1YMNhIRr29er1J0JJwCe0/8cnXTvl7X5PUcXa5jrFG	테스터2	\N	USER	EMAIL	2026-05-17 00:24:51.937	2026-05-17 00:24:51.937	\N	\N	f	\N
b6b7e397-b2dc-4cb4-ba19-20ce06947bd6	testuser3@test.com	$2b$10$d3/H251dtDU1YMNhIRr29er1J0JJwCe0/8cnXTvl7X5PUcXa5jrFG	테스터3	\N	USER	EMAIL	2026-05-17 00:24:51.938	2026-05-17 00:24:51.938	\N	\N	f	\N
4dae3806-eb8f-4df5-bc5f-8837a16397df	testuser4@test.com	$2b$10$d3/H251dtDU1YMNhIRr29er1J0JJwCe0/8cnXTvl7X5PUcXa5jrFG	테스터4	\N	USER	EMAIL	2026-05-17 00:24:51.94	2026-05-17 00:24:51.94	\N	\N	f	\N
62e943f9-21ad-4cc1-8f1f-b9b999ea336c	testuser5@test.com	$2b$10$d3/H251dtDU1YMNhIRr29er1J0JJwCe0/8cnXTvl7X5PUcXa5jrFG	테스터5	\N	USER	EMAIL	2026-05-17 00:24:51.941	2026-05-17 00:24:51.941	\N	\N	f	\N
a253dfa6-87b2-4627-9e3f-b179c9f1100a	testuser1@test.com	$2b$10$d3/H251dtDU1YMNhIRr29er1J0JJwCe0/8cnXTvl7X5PUcXa5jrFG	테스터1	\N	USER	EMAIL	2026-05-17 00:24:51.847	2026-05-17 00:41:11.214	\N	\N	f	2026-05-17 00:41:11.214
\.


--
-- Name: ban_histories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ban_histories_id_seq', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 32, true);


--
-- Name: comment_recommends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comment_recommends_id_seq', 4, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 6, true);


--
-- Name: email_verifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.email_verifications_id_seq', 2, true);


--
-- Name: news_recommends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.news_recommends_id_seq', 5, true);


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 2, true);


--
-- Name: post_likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.post_likes_id_seq', 1, false);


--
-- Name: post_recommends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.post_recommends_id_seq', 6, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_id_seq', 2, true);


--
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reports_id_seq', 3, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: ban_histories ban_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ban_histories
    ADD CONSTRAINT ban_histories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: comment_recommends comment_recommends_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_recommends
    ADD CONSTRAINT comment_recommends_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: editor_pick_articles editor_pick_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editor_pick_articles
    ADD CONSTRAINT editor_pick_articles_pkey PRIMARY KEY (id);


--
-- Name: email_verifications email_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verifications
    ADD CONSTRAINT email_verifications_pkey PRIMARY KEY (id);


--
-- Name: news_categories news_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_categories
    ADD CONSTRAINT news_categories_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: news_recommends news_recommends_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_recommends
    ADD CONSTRAINT news_recommends_pkey PRIMARY KEY (id);


--
-- Name: news_sources news_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_sources
    ADD CONSTRAINT news_sources_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: pipeline_logs pipeline_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pipeline_logs
    ADD CONSTRAINT pipeline_logs_pkey PRIMARY KEY (id);


--
-- Name: post_likes post_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_pkey PRIMARY KEY (id);


--
-- Name: post_likes post_likes_post_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_post_id_user_id_key UNIQUE (post_id, user_id);


--
-- Name: post_recommends post_recommends_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_recommends
    ADD CONSTRAINT post_recommends_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: system_configs system_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_configs
    ADD CONSTRAINT system_configs_pkey PRIMARY KEY (key);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ban_histories_admin_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ban_histories_admin_id_idx ON public.ban_histories USING btree (admin_id);


--
-- Name: ban_histories_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ban_histories_user_id_idx ON public.ban_histories USING btree (user_id);


--
-- Name: categories_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX categories_name_key ON public.categories USING btree (name);


--
-- Name: categories_parent_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_parent_id_idx ON public.categories USING btree (parent_id);


--
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- Name: comment_recommends_comment_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX comment_recommends_comment_id_idx ON public.comment_recommends USING btree (comment_id);


--
-- Name: comment_recommends_user_id_comment_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX comment_recommends_user_id_comment_id_key ON public.comment_recommends USING btree (user_id, comment_id);


--
-- Name: comments_parent_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX comments_parent_id_idx ON public.comments USING btree (parent_id);


--
-- Name: comments_post_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX comments_post_id_idx ON public.comments USING btree (post_id);


--
-- Name: editor_pick_articles_author_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX editor_pick_articles_author_id_idx ON public.editor_pick_articles USING btree (author_id);


--
-- Name: editor_pick_articles_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX editor_pick_articles_created_at_idx ON public.editor_pick_articles USING btree (created_at DESC);


--
-- Name: email_verifications_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX email_verifications_email_key ON public.email_verifications USING btree (email);


--
-- Name: news_categories_main_category_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX news_categories_main_category_is_active_idx ON public.news_categories USING btree (main_category, is_active);


--
-- Name: news_categories_main_category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX news_categories_main_category_name_key ON public.news_categories USING btree (main_category, name);


--
-- Name: news_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX news_created_at_idx ON public.news USING btree (created_at DESC);


--
-- Name: news_main_category_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX news_main_category_created_at_idx ON public.news USING btree (main_category, created_at DESC);


--
-- Name: news_original_link_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX news_original_link_key ON public.news USING btree (original_link);


--
-- Name: news_recommends_news_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX news_recommends_news_id_idx ON public.news_recommends USING btree (news_id);


--
-- Name: news_recommends_user_id_news_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX news_recommends_user_id_news_id_key ON public.news_recommends USING btree (user_id, news_id);


--
-- Name: news_sources_url_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX news_sources_url_key ON public.news_sources USING btree (url);


--
-- Name: news_sub_category_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX news_sub_category_created_at_idx ON public.news USING btree (sub_category, created_at DESC);


--
-- Name: password_reset_tokens_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX password_reset_tokens_email_key ON public.password_reset_tokens USING btree (email);


--
-- Name: pipeline_logs_run_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pipeline_logs_run_at_idx ON public.pipeline_logs USING btree (run_at DESC);


--
-- Name: post_recommends_post_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX post_recommends_post_id_idx ON public.post_recommends USING btree (post_id);


--
-- Name: post_recommends_user_id_post_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX post_recommends_user_id_post_id_key ON public.post_recommends USING btree (user_id, post_id);


--
-- Name: posts_author_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX posts_author_id_idx ON public.posts USING btree (author_id);


--
-- Name: posts_category_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX posts_category_id_idx ON public.posts USING btree (category_id);


--
-- Name: posts_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX posts_created_at_idx ON public.posts USING btree (created_at DESC);


--
-- Name: refresh_tokens_token_hash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX refresh_tokens_token_hash_key ON public.refresh_tokens USING btree (token_hash);


--
-- Name: reports_reporter_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reports_reporter_id_idx ON public.reports USING btree (reporter_id);


--
-- Name: reports_status_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reports_status_created_at_idx ON public.reports USING btree (status, created_at DESC);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_nickname_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_nickname_key ON public.users USING btree (nickname);


--
-- Name: ban_histories ban_histories_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ban_histories
    ADD CONSTRAINT ban_histories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: comment_recommends comment_recommends_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_recommends
    ADD CONSTRAINT comment_recommends_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comment_recommends comment_recommends_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_recommends
    ADD CONSTRAINT comment_recommends_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: comments comments_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.comments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: comments comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: editor_pick_articles editor_pick_articles_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editor_pick_articles
    ADD CONSTRAINT editor_pick_articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: news_recommends news_recommends_news_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_recommends
    ADD CONSTRAINT news_recommends_news_id_fkey FOREIGN KEY (news_id) REFERENCES public.news(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: news_recommends news_recommends_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_recommends
    ADD CONSTRAINT news_recommends_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_likes post_likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_likes post_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_recommends post_recommends_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_recommends
    ADD CONSTRAINT post_recommends_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_recommends post_recommends_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_recommends
    ADD CONSTRAINT post_recommends_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: posts posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: posts posts_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reports reports_reporter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict wfdXZY80hgMbebKGcJP948sxiZBdsTZHoVxdJ3FVDpi9O0nx93ftUms4rdhy8XL

