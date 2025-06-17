CREATE SCHEMA IF NOT EXISTS dashboard_public;
COMMENT ON SCHEMA dashboard_public is 'Publicly available information, like from 311 calls.';
ALTER SCHEMA dashboard_public OWNER TO dashboard_ht6k_user;

ALTER TABLE public.current_311 SET SCHEMA dashboard_public;
ALTER TABLE public.deprecated_311 SET SCHEMA dashboard_public;
ALTER TABLE public.parcel SET SCHEMA dashboard_public;