--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Debian 16.6-1.pgdg120+1)
-- Dumped by pg_dump version 16.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: dashboard_ht6k_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO dashboard_ht6k_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: current_311; Type: TABLE; Schema: public; Owner: dashboard_ht6k_user
--

CREATE TABLE public.current_311 (
    reported_issue text NOT NULL,
    latitude double precision,
    longitude double precision,
    resolved_date timestamp without time zone,
    department_work_group text,
    days_to_close text,
    issue_type text,
    issue_sub_type text,
    source_category text,
    incident_address text,
    open_date_time timestamp without time zone,
    last_updated timestamp without time zone,
    report_source text,
    workorder text,
    current_status text,
    additional_questions text,
    council_district text
);


ALTER TABLE public.current_311 OWNER TO dashboard_ht6k_user;

--
-- Name: deprecated_311; Type: TABLE; Schema: public; Owner: dashboard_ht6k_user
--

CREATE TABLE public.deprecated_311 (
    case_id bigint NOT NULL,
    source text,
    department text,
    work_group text,
    request_type text,
    category text,
    type text,
    detail text,
    creation_date timestamp without time zone,
    creation_time text,
    creation_month text,
    creation_year text,
    status text,
    exceeded_est_timeframe text,
    street_address text,
    zip_code text,
    neighborhood text,
    county text,
    council_district text,
    police_district text,
    parcel_id_no text,
    ycoordinate text,
    xcoordinate text,
    days_open text,
    computed_region_kk66_ngf4 text,
    computed_region_9t2m_phkm text,
    computed_region_my34_vmp8 text,
    computed_region_w4hf_t6bp text,
    latitude double precision,
    longitude double precision,
    case_url text,
    closed_date timestamp without time zone,
    closed_month text,
    closed_year text,
    days_to_close text
);


ALTER TABLE public.deprecated_311 OWNER TO dashboard_ht6k_user;

--
-- Name: parcel; Type: TABLE; Schema: public; Owner: dashboard_ht6k_user
--

CREATE TABLE public.parcel (
    objectid bigint,
    kivapin text,
    address text,
    apn text,
    parceltype text,
    platname text,
    prefix text,
    own_name text,
    own_addr text,
    own_city text,
    own_state text,
    own_zip text,
    shape_length text,
    shape_area text,
    latitude double precision,
    longitude double precision,
    lot text,
    block text,
    tract text,
    own_name2 text,
    own_addr2 text,
    addr text,
    fraction text,
    street text,
    street_type text,
    suite text,
    landusecode text,
    assessed_land_value text,
    assessed_improve_value text,
    exempt_land_value text,
    exempt_improve_value text,
    assessment_effective_date text,
    legal text
);


ALTER TABLE public.parcel OWNER TO dashboard_ht6k_user;

--
-- Name: current_311 current_311_pkey; Type: CONSTRAINT; Schema: public; Owner: dashboard_ht6k_user
--

ALTER TABLE ONLY public.current_311
    ADD CONSTRAINT current_311_pkey PRIMARY KEY (reported_issue);


--
-- Name: deprecated_311 deprecated_311_pkey; Type: CONSTRAINT; Schema: public; Owner: dashboard_ht6k_user
--

ALTER TABLE ONLY public.deprecated_311
    ADD CONSTRAINT deprecated_311_pkey PRIMARY KEY (case_id);
