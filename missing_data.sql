pg_dump: warning: there are circular foreign-key constraints on this table:
pg_dump: detail: comments
pg_dump: hint: You might not be able to restore the dump without using --disable-triggers or temporarily dropping the constraints.
pg_dump: hint: Consider using a full dump instead of a --data-only dump to avoid this problem.
--
-- PostgreSQL database dump
--

\restrict FSRRpkffxPTCnOGqcuQSNIXrH1duBaqsCDV6WSzlpdSUWPfpRCPnRdslqsmEyGr

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
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, title, content, view_count, author_id, category_id, created_at, updated_at, deleted_at, images, status) FROM stdin;
2	테스트	ㅎㅇㅎㅇㅎ<img src="https://pub-49c6917413ba4a2a8195975b5928be90.r2.dev/posts/847b6119-ff05-431d-a84b-7eff40629579/433f9331-9ec8-4072-9cb3-ad6baa5673da.png" alt="업로드 이미지" class="max-w-full h-auto rounded my-2"><br>	10	847b6119-ff05-431d-a84b-7eff40629579	5	2026-04-30 05:55:41.412	2026-05-19 09:01:44.124	\N	{}	PUBLISHED
1	플레이스테이션 사요	플레이스테이션 가격 얼마에요 보통 ?<img src="https://pub-49c6917413ba4a2a8195975b5928be90.r2.dev/posts/847b6119-ff05-431d-a84b-7eff40629579/1bb9797b-99ab-4ac1-a290-4f6ce57d94d1.jpg" alt="업로드 이미지" class="max-w-full h-auto rounded my-2"><br>	7	847b6119-ff05-431d-a84b-7eff40629579	24	2026-04-25 06:18:57.828	2026-05-19 10:24:23.541	\N	{}	PUBLISHED
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
-- Data for Name: comment_recommends; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comment_recommends (id, created_at, user_id, comment_id) FROM stdin;
3	2026-05-17 00:12:26.472	847b6119-ff05-431d-a84b-7eff40629579	2
4	2026-05-17 00:28:10.975	a253dfa6-87b2-4627-9e3f-b179c9f1100a	2
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
-- Name: comment_recommends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comment_recommends_id_seq', 4, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 6, true);


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
-- PostgreSQL database dump complete
--

\unrestrict FSRRpkffxPTCnOGqcuQSNIXrH1duBaqsCDV6WSzlpdSUWPfpRCPnRdslqsmEyGr

