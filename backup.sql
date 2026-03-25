--
-- PostgreSQL database dump
--

\restrict uDrYNeHbahOd65QAu4jlS5fujTuhXTDc1YKxI5x3Rr3C0NYbSx9EQ526NwklVKr

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.9 (Homebrew)

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
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_
        -- Filter by action early - only get subscriptions interested in this action
        -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
        and (subs.action_filter = '*' or subs.action_filter = action::text);

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.protect_delete() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


ALTER TABLE auth.custom_oauth_providers OWNER TO supabase_auth_admin;

--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


ALTER TABLE auth.webauthn_challenges OWNER TO supabase_auth_admin;

--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


ALTER TABLE auth.webauthn_credentials OWNER TO supabase_auth_admin;

--
-- Name: analytics_daily; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analytics_daily (
    id integer NOT NULL,
    date date NOT NULL,
    page_slug text NOT NULL,
    total_views integer DEFAULT 0,
    unique_visitors integer DEFAULT 0,
    bounce_rate double precision,
    avg_time_on_page integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.analytics_daily OWNER TO postgres;

--
-- Name: analytics_daily_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.analytics_daily_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.analytics_daily_id_seq OWNER TO postgres;

--
-- Name: analytics_daily_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.analytics_daily_id_seq OWNED BY public.analytics_daily.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    user_id integer NOT NULL,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id integer NOT NULL,
    entity_name text,
    changes text,
    old_values text,
    new_values text,
    metadata text,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    created_by integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone
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
-- Name: comment_replies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment_replies (
    id integer NOT NULL,
    comment_id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    content text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    ip_address text,
    user_agent text,
    is_spam boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.comment_replies OWNER TO postgres;

--
-- Name: comment_replies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comment_replies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comment_replies_id_seq OWNER TO postgres;

--
-- Name: comment_replies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comment_replies_id_seq OWNED BY public.comment_replies.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    content_id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    content text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    ip_address text,
    user_agent text,
    is_spam boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone
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
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_submissions (
    id integer NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    phone_number text,
    country text,
    subject text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.contact_submissions OWNER TO postgres;

--
-- Name: contact_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_submissions_id_seq OWNER TO postgres;

--
-- Name: contact_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_submissions_id_seq OWNED BY public.contact_submissions.id;


--
-- Name: contents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contents (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    excerpt text,
    type text DEFAULT 'article'::text NOT NULL,
    category_id integer,
    featured_image text,
    status text DEFAULT 'draft'::text NOT NULL,
    published_at timestamp without time zone,
    meta_title text,
    meta_description text,
    meta_keywords text,
    canonical_url text,
    robots text,
    og_title text,
    og_description text,
    og_image text,
    created_by integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone,
    scheduled_at timestamp without time zone
);


ALTER TABLE public.contents OWNER TO postgres;

--
-- Name: contents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contents_id_seq OWNER TO postgres;

--
-- Name: contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contents_id_seq OWNED BY public.contents.id;


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faqs (
    id integer NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    category text,
    "order" integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'published'::text NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.faqs OWNER TO postgres;

--
-- Name: faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faqs_id_seq OWNER TO postgres;

--
-- Name: faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faqs_id_seq OWNED BY public.faqs.id;


--
-- Name: gallery_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gallery_categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone
);


ALTER TABLE public.gallery_categories OWNER TO postgres;

--
-- Name: gallery_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gallery_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gallery_categories_id_seq OWNER TO postgres;

--
-- Name: gallery_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gallery_categories_id_seq OWNED BY public.gallery_categories.id;


--
-- Name: gallery_of_works; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gallery_of_works (
    id integer NOT NULL,
    category_id integer NOT NULL,
    title text NOT NULL,
    subtitle text,
    description text,
    image_url text NOT NULL,
    slug text NOT NULL,
    display_order integer DEFAULT 0,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone
);


ALTER TABLE public.gallery_of_works OWNER TO postgres;

--
-- Name: gallery_of_works_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gallery_of_works_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gallery_of_works_id_seq OWNER TO postgres;

--
-- Name: gallery_of_works_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gallery_of_works_id_seq OWNED BY public.gallery_of_works.id;


--
-- Name: login_attempts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_attempts (
    id bigint NOT NULL,
    identifier text NOT NULL,
    attempted_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.login_attempts OWNER TO postgres;

--
-- Name: login_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.login_attempts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.login_attempts_id_seq OWNER TO postgres;

--
-- Name: login_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.login_attempts_id_seq OWNED BY public.login_attempts.id;


--
-- Name: login_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_logs (
    id integer NOT NULL,
    user_id integer,
    email text NOT NULL,
    success boolean NOT NULL,
    failure_reason text,
    ip_address text NOT NULL,
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.login_logs OWNER TO postgres;

--
-- Name: login_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.login_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.login_logs_id_seq OWNER TO postgres;

--
-- Name: login_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.login_logs_id_seq OWNED BY public.login_logs.id;


--
-- Name: media_gallery; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media_gallery (
    id integer NOT NULL,
    filename text NOT NULL,
    url text NOT NULL,
    type text NOT NULL,
    original_name text NOT NULL,
    file_size integer NOT NULL,
    mime_type text NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.media_gallery OWNER TO postgres;

--
-- Name: media_gallery_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.media_gallery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_gallery_id_seq OWNER TO postgres;

--
-- Name: media_gallery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.media_gallery_id_seq OWNED BY public.media_gallery.id;


--
-- Name: navigation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.navigation (
    id integer NOT NULL,
    label text NOT NULL,
    url text NOT NULL,
    parent_id integer,
    "order" integer DEFAULT 0 NOT NULL,
    icon text,
    target text DEFAULT '_self'::text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone,
    platform character varying
);


ALTER TABLE public.navigation OWNER TO postgres;

--
-- Name: navigation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.navigation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.navigation_id_seq OWNER TO postgres;

--
-- Name: navigation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.navigation_id_seq OWNED BY public.navigation.id;


--
-- Name: page_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.page_sections (
    id integer NOT NULL,
    page_name text NOT NULL,
    page_slug text NOT NULL,
    page_data text NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.page_sections OWNER TO postgres;

--
-- Name: page_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.page_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.page_sections_id_seq OWNER TO postgres;

--
-- Name: page_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.page_sections_id_seq OWNED BY public.page_sections.id;


--
-- Name: page_views; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.page_views (
    id integer NOT NULL,
    page_slug text NOT NULL,
    page_title text,
    visitor_id text NOT NULL,
    referrer text,
    user_agent text,
    ip_address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.page_views OWNER TO postgres;

--
-- Name: page_views_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.page_views_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.page_views_id_seq OWNER TO postgres;

--
-- Name: page_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.page_views_id_seq OWNED BY public.page_views.id;


--
-- Name: pages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pages (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    meta_title text,
    meta_description text,
    created_by integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone,
    scheduled_at timestamp without time zone,
    published_at timestamp without time zone
);


ALTER TABLE public.pages OWNER TO postgres;

--
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pages_id_seq OWNER TO postgres;

--
-- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pages_id_seq OWNED BY public.pages.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    key text NOT NULL,
    value text,
    type text DEFAULT 'string'::text NOT NULL,
    description text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.settings OWNER TO postgres;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.settings_id_seq OWNER TO postgres;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'editor'::text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: visitors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visitors (
    id integer NOT NULL,
    visitor_id text NOT NULL,
    referer_domain text,
    country text,
    city text,
    user_agent text,
    ip_address text,
    first_visit timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_visit timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    page_views_count integer DEFAULT 1
);


ALTER TABLE public.visitors OWNER TO postgres;

--
-- Name: visitors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.visitors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.visitors_id_seq OWNER TO postgres;

--
-- Name: visitors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.visitors_id_seq OWNED BY public.visitors.id;


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: analytics_daily id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_daily ALTER COLUMN id SET DEFAULT nextval('public.analytics_daily_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: comment_replies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_replies ALTER COLUMN id SET DEFAULT nextval('public.comment_replies_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: contact_submissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submissions ALTER COLUMN id SET DEFAULT nextval('public.contact_submissions_id_seq'::regclass);


--
-- Name: contents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contents ALTER COLUMN id SET DEFAULT nextval('public.contents_id_seq'::regclass);


--
-- Name: faqs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faqs ALTER COLUMN id SET DEFAULT nextval('public.faqs_id_seq'::regclass);


--
-- Name: gallery_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_categories ALTER COLUMN id SET DEFAULT nextval('public.gallery_categories_id_seq'::regclass);


--
-- Name: gallery_of_works id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_of_works ALTER COLUMN id SET DEFAULT nextval('public.gallery_of_works_id_seq'::regclass);


--
-- Name: login_attempts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_attempts ALTER COLUMN id SET DEFAULT nextval('public.login_attempts_id_seq'::regclass);


--
-- Name: login_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_logs ALTER COLUMN id SET DEFAULT nextval('public.login_logs_id_seq'::regclass);


--
-- Name: media_gallery id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_gallery ALTER COLUMN id SET DEFAULT nextval('public.media_gallery_id_seq'::regclass);


--
-- Name: navigation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.navigation ALTER COLUMN id SET DEFAULT nextval('public.navigation_id_seq'::regclass);


--
-- Name: page_sections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_sections ALTER COLUMN id SET DEFAULT nextval('public.page_sections_id_seq'::regclass);


--
-- Name: page_views id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_views ALTER COLUMN id SET DEFAULT nextval('public.page_views_id_seq'::regclass);


--
-- Name: pages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT nextval('public.pages_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: visitors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitors ALTER COLUMN id SET DEFAULT nextval('public.visitors_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_challenges (id, user_id, challenge_type, session_data, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_credentials (id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at) FROM stdin;
\.


--
-- Data for Name: analytics_daily; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.analytics_daily (id, date, page_slug, total_views, unique_visitors, bounce_rate, avg_time_on_page, created_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, action, entity_type, entity_id, entity_name, changes, old_values, new_values, metadata, created_at) FROM stdin;
1	1	update	contents	1	lorem ipsum dolor sit amet Edit	{"title":{"from":"lorem ipsum dolor sit amet","to":"lorem ipsum dolor sit amet Edit"},"slug":{"from":"lorem-ipsum-dolor-sit-amet","to":"lorem-ipsum-dolor-sit-amet-edit"}}	{"title":"lorem ipsum dolor sit amet","slug":"lorem-ipsum-dolor-sit-amet","status":"published"}	{"title":"lorem ipsum dolor sit amet Edit","slug":"lorem-ipsum-dolor-sit-amet-edit","status":"published"}	{"userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36","referer":"http://localhost:3000/app/content/1/edit","ip":"::1"}	2026-03-10 13:49:39.027
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, description, created_by, created_at, updated_at, deleted_at) FROM stdin;
1	General	general	\N	1	2026-03-06 22:22:56.328	2026-03-06 22:22:56.328	\N
2	Adventure Tours	adventure-tours	Thrilling outdoor adventures and expedition experiences around the world	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N
3	Beach Escapes	beach-escapes	Relaxing beach vacations and seaside resort experiences	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N
4	Cultural Heritage	cultural-heritage	Immersive cultural experiences and historical tour packages	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N
5	Luxury Retreats	luxury-retreats	Exclusive luxury vacation experiences and high-end accommodations	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N
6	Wellness & Spa	wellness-spa	Rejuvenating wellness retreats and spa packages	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N
\.


--
-- Data for Name: comment_replies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comment_replies (id, comment_id, name, email, content, status, ip_address, user_agent, is_spam, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, content_id, name, email, content, status, ip_address, user_agent, is_spam, created_at, updated_at, deleted_at) FROM stdin;
1	1	Kelvin Kurniawan	tepinnko@gmail.com	Halo kak	approved	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	f	2026-03-10 07:21:26.14	2026-03-10 09:12:46.331	\N
\.


--
-- Data for Name: contact_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_submissions (id, full_name, email, phone_number, country, subject, message, status, created_at, updated_at) FROM stdin;
1	Kelvin Kurniawan	tepinnko@gmail.com	085747570111	Indonesia	Hai Tolong dibantu	Halo selamat pagi, tolong kirim proposal ya	read	2026-03-13 02:14:00.597	2026-03-13 02:14:24.273
\.


--
-- Data for Name: contents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contents (id, title, slug, content, excerpt, type, category_id, featured_image, status, published_at, meta_title, meta_description, meta_keywords, canonical_url, robots, og_title, og_description, og_image, created_by, created_at, updated_at, deleted_at, scheduled_at) FROM stdin;
1	lorem ipsum dolor sit amet Edit	lorem-ipsum-dolor-sit-amet-edit	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel tortor non felis malesuada ullamcorper. Nunc efficitur luctus nulla, a sollicitudin magna egestas id. Praesent id ultricies dolor. Donec luctus sem tempus orci pretium, vitae imperdiet metus efficitur. Suspendisse eu massa ut tellus fermentum venenatis eget rutrum risus. Praesent a ultricies nisi, ac sollicitudin leo. Quisque elementum a mi non sollicitudin. Etiam ac ex et odio eleifend tempus.</p><p style="text-align: justify;">Praesent libero ipsum, commodo nec mattis sed, placerat eu tellus. Praesent consectetur enim tortor, eget scelerisque metus tempus non. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam pharetra aliquet tellus quis ullamcorper. In at ultrices ligula. Fusce ultrices et magna quis lacinia. Curabitur finibus sapien faucibus sapien porta pharetra. Suspendisse luctus augue sed feugiat commodo. Vivamus commodo finibus ante, et mattis felis dignissim sed. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis ut commodo velit.</p><p style="text-align: justify;">Integer commodo malesuada lacus, non dignissim nunc consequat at. Nullam condimentum nunc sed luctus ornare. Vivamus rutrum tortor vitae gravida posuere. Vestibulum viverra, diam non facilisis varius, libero tellus posuere erat, eu eleifend tellus erat nec nibh. Nam tempor augue condimentum, egestas nunc ac, consectetur nunc. Praesent erat ante, placerat eget fermentum ac, euismod eget elit. Sed non nibh a massa feugiat iaculis. Fusce tempus efficitur ipsum vel dapibus. Pellentesque eget nisi sed lacus vestibulum iaculis et id ipsum. Quisque ultricies orci quis interdum dignissim. Integer vel justo sapien. Morbi luctus vitae purus quis placerat. Nunc non convallis elit, vitae ullamcorper tortor. Donec malesuada posuere odio, eu placerat lorem.</p><p style="text-align: justify;">In vel ante et mauris blandit vehicula. Vivamus imperdiet est iaculis, suscipit odio sed, vehicula risus. Sed tincidunt ante in blandit semper. Aenean elementum sem sed quam euismod, eu sagittis augue viverra. Proin quis arcu fringilla, pretium ligula vitae, luctus quam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras id libero in lacus fermentum lobortis. Vestibulum nec nisi molestie, imperdiet enim nec, ornare elit. Vivamus commodo vestibulum sem, at viverra purus finibus vitae.</p><p style="text-align: justify;">Aliquam erat volutpat. Proin feugiat suscipit quam a luctus. Vivamus pharetra arcu eros, id dapibus ex posuere et. Phasellus pellentesque facilisis odio vitae fringilla. Aenean ultrices consequat nisi, sed porttitor ex malesuada ut. Suspendisse et diam ex. Phasellus lobortis at diam in malesuada. Morbi luctus metus in risus sagittis, ac aliquam elit lacinia. Phasellus id purus eu nisl consectetur dignissim et ac neque. Sed eu ante malesuada, egestas nisi vitae, laoreet ex. Mauris eleifend ipsum lorem, eu semper quam porta ac. Morbi tempor tortor nec mi luctus rhoncus. Duis risus libero, iaculis id mauris in, tempus rutrum magna. Vestibulum congue mauris dictum blandit placerat.</p>	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum	article	1	\N	published	2026-03-10 04:45:00	\N	\N	\N	\N	\N	\N	\N	\N	1	2026-03-10 04:48:45.963	2026-03-10 13:49:38.89	\N	\N
2	Mountain Climbing Expedition to Peak Adventures	mountain-climbing-expedition	<p>Experience the thrill of conquering some of the world's most spectacular peaks. Our expert guides will lead you through challenging terrain and breathtaking landscapes. This 10-day expedition includes professional mountaineering training, high-altitude acclimatization, and summit attempts with full safety equipment and support.</p><p>Perfect for adventurers seeking an unforgettable challenge and stunning views from the top of the world.</p>	Join us on an epic mountain climbing expedition to conquer challenging peaks with expert guides and comprehensive safety support.	article	1	https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Mountain Climbing Expedition | Adventure Tours	Join our mountain climbing expedition with expert guides. Conquer peaks and experience breathtaking landscapes.	mountain climbing, expedition, adventure, trekking, peaks	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
3	Jungle Safari Through Rainforest Wonders	jungle-safari-rainforest	<p>Explore the most biodiverse regions on Earth with our guided jungle safari expeditions. Navigate pristine rainforests, spot exotic wildlife, and discover hidden waterfalls. Our experienced naturalist guides will teach you about the ecosystem while you stay in comfortable eco-lodges.</p><p>This immersive 8-day adventure includes daily jungle treks, wildlife observation, indigenous community interactions, and photography opportunities.</p>	Discover the untamed beauty of rainforests with guided wildlife safari through pristine jungle landscapes.	article	1	https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Jungle Safari Rainforest Adventure | Explore Wildlife	Experience jungle safari through pristine rainforests. Spot exotic wildlife and discover hidden natural wonders.	jungle safari, rainforest, wildlife, adventure, nature	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
4	Rock Climbing & Rappelling in Dramatic Canyons	rock-climbing-canyons	<p>Test your climbing skills and conquer vertical rock faces in some of the world's most dramatic canyon systems. Our certified climbing instructors provide comprehensive training and safety briefings for climbers of all skill levels. Experience the rush of ascending challenging routes with panoramic canyon views.</p><p>The 5-day program includes rope management, safety protocols, technical climbing instruction, and spectacular rappelling descents.</p>	Master rock climbing and rappelling techniques while exploring stunning canyon landscapes with professional instructors.	article	1	https://images.unsplash.com/photo-1522163182402-834ff146da16?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Rock Climbing Canyon Adventure | Technical Climbing	Learn rock climbing and rappelling in dramatic canyons. World-class instruction for all skill levels.	rock climbing, rappelling, canyons, adventure, outdoors	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
5	White Water Rafting Down Roaring Rivers	white-water-rafting-rivers	<p>Experience the adrenaline rush of navigating class IV and V white water rapids through pristine river canyons. Professional river guides accompany every raft, ensuring safety while delivering maximum excitement. Navigate through stunning geological formations and untamed wilderness.</p><p>Our 6-day white water adventure includes multiple rivers, varying difficulty levels, riverside camping, and gourmet meal preparation in the wilderness.</p>	Navigate thrilling white water rapids through scenic river canyons with expert guides and comprehensive safety gear.	article	1	https://images.unsplash.com/photo-1541625602330-2277a4647d6e?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	White Water Rafting Adventure | River Tours	Experience white water rafting through exciting rapids and scenic canyons with professional guides.	white water rafting, rivers, adventure, rapids, outdoor	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
6	Desert Expedition & Star Gazing Experience	desert-expedition-stargazing	<p>Journey into vast desert landscapes under some of the clearest night skies on Earth. Our desert expeditions combine camel trekking, dune exploration, and luxury Bedouin-style tent camping. As the sun sets, experience world-class stargazing with our astronomy guides who reveal the wonders of the cosmos.</p><p>This 7-day desert experience includes daily camel treks, sandboard lessons, traditional desert cuisine, and nightly astronomy sessions.</p>	Explore vast desert landscapes and experience exceptional stargazing under pristine night skies with expert astronomers.	article	1	https://images.unsplash.com/photo-1467270351994-14ae9a54c3f1?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Desert Expedition Stargazing | Adventure Tours	Desert trekking and astronomy experience. Explore endless dunes and gaze at the stars with expert guides.	desert expedition, stargazing, astronomy, adventure, trekking	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
7	Tropical Island Paradise with Crystal Waters	tropical-island-paradise	<p>Escape to pristine tropical islands surrounded by crystal-clear turquoise waters and white sand beaches. Our all-inclusive island packages feature luxury beachfront resorts, water sports, snorkeling, and private island excursions. Immerse yourself in tropical paradise with perfect weather, exotic cuisine, and world-class hospitality.</p><p>The 5-day tropical escape includes beachfront accommodation, daily water sports, spa treatments, and gourmet dining experiences.</p>	Discover tropical island paradise with pristine beaches, crystal waters, and luxury resort accommodations.	article	2	https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Tropical Island Paradise | Beach Resort Escape	Experience tropical island paradise with luxury resorts, crystal waters, and white sandy beaches.	tropical islands, beach, paradise, vacation, resort	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
8	Luxury Beachfront Villa Retreat	luxury-beachfront-villa	<p>Indulge in ultimate luxury at an exclusive beachfront villa with private beach access and ocean views. These stunning villas feature infinity pools, premium amenities, private chefs, and personalized concierge services. Perfect for couples seeking romance or families wanting an exclusive beach experience.</p><p>Our villa packages include luxury accommodation, private beach, infinity pool, gourmet dining, spa services, and water sports activities.</p>	Stay in exclusive luxury beachfront villas with private pools, personal chefs, and pristine beach access.	article	2	https://images.unsplash.com/photo-1520250497591-112f2980fc06?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Luxury Beachfront Villa Retreat | Exclusive Getaway	Exclusive luxury beachfront villas with private amenities, gourmet dining, and pristine ocean views.	luxury villa, beachfront, resort, vacation, private beach	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
9	Coral Reef Snorkeling Adventure	coral-reef-snorkeling	<p>Explore vibrant coral reefs teeming with colorful fish and marine life. Our guided snorkeling excursions take you to protected marine reserves where you'll encounter sea turtles, tropical fish, and pristine coral ecosystems. Professional guides ensure your safety while providing fascinating insights into marine biology and conservation.</p><p>The 4-day snorkeling adventure includes daily reef excursions, marine biology briefings, beach relaxation, and sunset sailing.</p>	Snorkel vibrant coral reefs and encounter exotic marine life in protected underwater sanctuaries.	article	2	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Coral Reef Snorkeling | Marine Adventure	Guided snorkeling in pristine coral reefs with marine biologists. Encounter sea turtles and tropical fish.	snorkeling, coral reef, beach, marine life, water sports	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
10	Sunset Sailing & Seaside Dining	sunset-sailing-dining	<p>Experience romantic sunset sailing on luxury yacht vessels with gourmet dining at sea. Glide across calm ocean waters as the sun paints the sky in golden hues, enjoying fine dining prepared by award-winning chefs. Perfect for romantic getaways, anniversaries, or special celebrations with unforgettable ocean vistas.</p><p>Evening packages include sunset sail, gourmet multi-course dinner, premium beverages, live music, and private deck access.</p>	Enjoy romantic sunset sailing on luxury yachts with gourmet dining and ocean panoramas.	article	2	https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Sunset Sailing & Seaside Dining | Romantic Escape	Romantic sunset sailing with gourmet dining, live music, and luxurious yacht experience.	sailing, sunset, yacht, dining, romantic vacation	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
11	Beach Spa Wellness Retreat	beach-spa-wellness	<p>Rejuvenate your body and mind at our beachfront spa wellness retreat. Enjoy daily yoga and meditation sessions with ocean views, professional spa treatments using natural ingredients, and nutritious cuisine focused on health and wellness. The healing sound of waves combined with expert therapists creates the perfect environment for renewal and relaxation.</p><p>The 6-day wellness retreat includes accommodation, daily yoga, meditation, spa treatments, healthy cuisine, and wellness workshops.</p>	Rejuvenate at beachfront wellness retreat with yoga, spa treatments, and healthy cuisine.	article	2	https://images.unsplash.com/photo-1543862475-eb785736ad0f?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Beach Spa Wellness Retreat | Relaxation Vacation	Beachfront wellness retreat with yoga, spa treatments, meditation, and restorative wellness programs.	wellness, spa, beach, yoga, relaxation, retreat	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
12	Ancient Temple Tour Through Sacred Sites	ancient-temple-tour	<p>Journey through centuries of history exploring magnificent ancient temples and sacred sites. Our expert historians and local guides provide deep insights into the cultural significance, architectural brilliance, and spiritual importance of each location. Visit intricately carved temples, monasteries, and religious monuments that have stood for millennia.</p><p>The 8-day cultural tour includes guided temple visits, expert lectures, local community interactions, photography opportunities, and cultural workshops.</p>	Explore magnificent ancient temples and sacred sites with expert historians and local cultural guides.	article	3	https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Ancient Temple Tour | Cultural Heritage Sites	Expert-guided tours through ancient temples, sacred sites, and historical monuments with cultural insights.	temples, cultural heritage, history, archaeology, ancient sites	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
13	Traditional Art & Craft Master Classes	traditional-art-craft	<p>Learn authentic traditional arts and crafts directly from master artisans. Participate in hands-on workshops creating textiles, pottery, paintings, and sculptures using centuries-old techniques passed down through generations. Gain deep appreciation for cultural traditions while creating your own artistic masterpieces to take home.</p><p>The 5-day craft workshop includes daily master classes, art supplies, material costs, artisan interactions, and gallery visit.</p>	Master traditional arts and crafts through hands-on workshops with expert local artisans and craftspeople.	article	3	https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Traditional Art & Craft Classes | Cultural Learning	Learn traditional arts and crafts from master artisans. Hands-on workshops in textile, pottery, and painting.	traditional art, craft, workshops, cultural learning, artisan	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
14	Culinary Heritage Food Tour	culinary-heritage-food	<p>Discover authentic culinary traditions through immersive food tours and cooking classes. Visit local markets, meet traditional cooks, and learn to prepare signature dishes using family recipes and local ingredients. Experience the cultural significance of food in different regions through market exploration, cooking classes, and festive meals with local families.</p><p>The 6-day culinary tour includes market visits, cooking classes, restaurant experiences, local family dinners, and food history lessons.</p>	Explore authentic culinary traditions through markets, cooking classes, and meals with local families.	article	3	https://images.unsplash.com/photo-1496627666981-5047e0db3b37?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Culinary Heritage Food Tour | Authentic Cuisine	Explore authentic culinary traditions through cooking classes, markets, and local family dinners.	food tour, culinary, cooking class, local cuisine, heritage	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
15	Historical Museum & Archive Expedition	historical-museum-archive	<p>Access restricted museum archives and behind-the-scenes collections with expert curators. Explore rare artifacts, historical documents, and museum storage areas typically closed to the public. Learn the stories behind priceless collections and understand how museums preserve cultural heritage for future generations.</p><p>The 4-day museum expedition includes curator-guided tours, archive access, conservation demonstrations, and exclusive lectures.</p>	Explore rare artifacts and museum archives with expert curators during exclusive behind-the-scenes tours.	article	3	https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Historical Museum & Archive Expedition | Cultural Access	Exclusive museum archive tours with rare artifacts and curator-guided historical exploration.	museum, history, archives, artifacts, cultural heritage	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
16	Indigenous Culture & Community Experience	indigenous-culture-community	<p>Experience authentic indigenous cultures through respectful, community-based tourism. Live with indigenous families, participate in daily activities, learn traditional languages, and understand spiritual practices. Support local communities directly while gaining genuine cultural insights and building meaningful cross-cultural connections.</p><p>The 7-day cultural immersion includes homestay accommodation, daily activities, language lessons, spiritual ceremonies, and community meals.</p>	Experience authentic indigenous cultures through homestays, daily activities, and meaningful community connections.	article	3	https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Indigenous Culture Experience | Community Tourism	Authentic indigenous culture immersion with community homestays and respectful cultural exchange.	indigenous culture, community, travel, cultural exchange, linguistics	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
17	Five-Star Private Island Resort	five-star-private-island	<p>Escape to an exclusive private island resort accessible only to guests. Experience ultra-luxury accommodations with personal butlers, Michelin-star dining, infinity pools overlooking pristine waters, and world-class spa facilities. Every detail is meticulously crafted for absolute comfort and indulgence with unparalleled privacy and service excellence.</p><p>Private island packages include luxury villa accommodation, personal butler service, gourmet dining, water sports, spa, and helicopter transfers.</p>	Exclusive private island resort with luxury villas, personal butler service, and five-star amenities.	article	4	https://images.unsplash.com/photo-1553531088-eef8a64da54e?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Five-Star Private Island Resort | Luxury Escape	Ultra-luxury private island resort with personal butler, gourmet dining, and exclusive beach access.	luxury resort, private island, five-star, vacation, exclusive	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
18	Alpine Mountain Luxury Chalet Experience	alpine-mountain-chalet	<p>Indulge in ultimate Alpine luxury at exclusive mountain chalets with breathtaking peak views. These stunning properties feature roaring fireplaces, premium furnishings, private hot tubs, wine cellars, and gourmet kitchens. Enjoy mountain activities by day and cozy luxury by night with world-class spa services and fine dining experiences.</p><p>Alpine chalet packages include luxury accommodation, concierge services, spa treatments, fine dining, and mountain activities.</p>	Alpine luxury chalets with premium amenities, private hot tubs, and gourmet mountain dining experiences.	article	4	https://images.unsplash.com/photo-1566576722541-b34c7f37141d?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Alpine Mountain Luxury Chalet | Premium Retreat	Luxury Alpine chalets with premium furnishings, spa services, and fine dining mountain experiences.	alpine chalet, luxury, mountain resort, vacation, skiing	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
19	Palace Hotel Grand Heritage Experience	palace-hotel-heritage	<p>Stay in magnificently restored palace hotels that blend historic grandeur with modern luxury. These iconic properties showcase original architectural details, period furnishings, and cultural significance while offering contemporary comfort and amenities. Experience timeless elegance in locations rich with history and royal heritage.</p><p>Palace hotel stays include historic suite accommodation, heritage tours, gourmet dining, spa access, and concierge service.</p>	Stay in historic palace hotels blending royal heritage with modern luxury and cultural significance.	article	4	https://images.unsplash.com/photo-1631336344892-54dc1a9a5d69?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Palace Hotel Grand Heritage | Historic Luxury	Historic palace hotels with royal heritage, luxury suites, and cultural significance.	palace hotel, heritage, luxury, historic, vacation	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
20	Exclusive Golf Course & Resort Package	exclusive-golf-resort	<p>Access world-renowned private golf courses at exclusive resorts. Enjoy championship-level courses designed by legendary architects, professional coaching from PGA instructors, and luxurious on-course accommodations. Perfect for golf enthusiasts seeking the finest courses combined with premium resort facilities and amenities.</p><p>Golf resort packages include luxury accommodation, unlimited golf rounds, PGA instruction, caddy service, spa, and fine dining.</p>	Exclusive private golf courses with championship designs and luxury resort facilities combined.	article	4	https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Exclusive Golf Course & Resort | Premium Golf	Private championship golf courses with luxury resorts, PGA instruction, and premium amenities.	golf resort, luxury, private course, championship, vacation	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
21	Helicopter Tour & Luxury Dinner Experience	helicopter-luxury-dinner	<p>Experience ultimate luxury with private helicopter tours showcasing spectacular landscapes, followed by gourmet dinners in exclusive venues. Combine breathtaking aerial sightseeing with Michelin-star dining and champagne celebrations. Perfect for special occasions, anniversaries, or those seeking unforgettable luxury experiences combining adventure and fine dining.</p><p>Helicopter packages include private helicopter charter, scenic tour, luxury dinner, premium beverages, and ground transfers.</p>	Private helicopter tours with aerial sightseeing followed by gourmet dinners in exclusive venues.	article	4	https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Helicopter Tour & Luxury Dinner | Premium Experience	Private helicopter tours with luxury dinner experiences, scenic flights, and Michelin-star dining.	helicopter tour, luxury, dining, scenic, exclusive	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
22	Ayurvedic Healing & Traditional Medicine Retreat	ayurvedic-healing-retreat	<p>Discover ancient Ayurvedic healing practices and traditional medicine through immersive wellness retreats. Work with certified Ayurvedic practitioners to create personalized wellness plans, receive authentic treatments, and learn traditional healing techniques. Experience rejuvenation through massage, herbal remedies, yoga, meditation, and dietary plans aligned with your individual constitution.</p><p>Ayurvedic retreat includes accommodation, personalized consultations, daily treatments, yoga classes, and herbal meals.</p>	Authentic Ayurvedic healing and traditional medicine retreat with personalized wellness plans.	article	5	https://images.unsplash.com/photo-1526495124232-a04b0903ba3d?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Ayurvedic Healing Retreat | Traditional Wellness	Authentic Ayurvedic retreat with traditional healing, personalized treatments, and wellness plans.	ayurveda, healing, wellness, traditional medicine, retreat	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
23	Yoga & Meditation Intensive Program	yoga-meditation-intensive	<p>Immerse yourself in comprehensive yoga and meditation programs with world-renowned instructors. Daily asana classes, pranayama breathing techniques, meditation sessions, philosophy lectures, and lifestyle coaching guide you toward inner peace and physical vitality. Programs cater to all levels from beginners to advanced practitioners seeking deeper spiritual connection.</p><p>Yoga intensive includes accommodation, daily classes, group meditation, philosophy lectures, vegetarian meals, and materials.</p>	Intensive yoga and meditation programs with world-renowned instructors and daily spiritual practices.	article	5	https://images.unsplash.com/photo-1544993795-c4da6ffb5e51?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Yoga & Meditation Intensive | Spiritual Wellness	Intensive yoga and meditation programs with expert instruction, daily practices, and spiritual guidance.	yoga, meditation, wellness, instruction, mindfulness	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
24	Detox & Organic Cleansing Retreat	detox-cleansing-retreat	<p>Reset your body and mind through comprehensive detox and cleansing programs. Supervised by wellness doctors, these programs include organic juice cleanses, nutritious meals, herbal treatments, body therapies, and lifestyle coaching. Experience energy renewal and toxin elimination through evidence-based practices in beautiful, health-focused environments.</p><p>Detox retreat includes accommodation, daily detox meals, juice cleanses, spa treatments, consultations, and wellness education.</p>	Comprehensive detox and cleansing retreat with organic nutrition and professional wellness supervision.	article	5	https://images.unsplash.com/photo-1506797048baad5f3caf91e7876e4f5e8?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Detox & Cleansing Retreat | Health Wellness	Supervised detox retreat with organic nutrition, cleansing programs, and wellness restoration.	detox, cleansing, wellness, organic, health retreat	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
25	Holistic Wellness Spa Package	holistic-wellness-spa	<p>Experience comprehensive holistic wellness through integrated spa and wellness packages. Receive Swedish massage, aromatherapy, facials, body treatments, reflexology, and energy healing sessions from certified therapists. Complementary wellness consultations guide personalized wellness journeys combining ancient practices with modern therapeutic techniques.</p><p>Holistic spa packages include accommodation, daily treatments, wellness consultations, healthy meals, and access to wellness facilities.</p>	Holistic wellness spa combining massage, aromatherapy, energy healing, and personalized wellness care.	article	5	https://images.unsplash.com/photo-1600334089393-b70033a65718?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Holistic Wellness Spa | Therapeutic Treatments	Holistic spa with massage, aromatherapy, energy healing, and comprehensive wellness treatments.	spa, wellness, massage, aromatherapy, holistic health	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
26	Fitness Transformation Bootcamp	fitness-transformation-bootcamp	<p>Achieve your fitness goals through intensive transformation bootcamps led by elite fitness trainers. Personalized training programs, nutritional counseling, group fitness classes, and wellness coaching combine to create lasting lifestyle changes. Programs accommodate all fitness levels with adaptable intensity and focus on sustainable health improvements.</p><p>Fitness bootcamp includes accommodation, daily training sessions, nutritional guidance, meal planning, and fitness assessments.</p>	Elite fitness bootcamp with personalized training, nutritional coaching, and transformation programs.	article	5	https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Fitness Transformation Bootcamp | Health Training	Intensive fitness bootcamp with elite trainers, personalized programs, and nutritional coaching.	fitness, bootcamp, training, transformation, wellness	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faqs (id, question, answer, category, "order", status, created_by, created_at, updated_at, deleted_at) FROM stdin;
1	Apa itu takshaka ?	Takshaka adalah travel manajement agent 		0	published	1	2026-03-10 08:19:37.706	2026-03-10 08:19:37.706	\N
2	Cara menghubungi takshaka	Melalui email dan nomor telepon yang tertera		0	published	1	2026-03-10 08:22:08.34	2026-03-10 08:22:08.34	\N
\.


--
-- Data for Name: gallery_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gallery_categories (id, name, slug, display_order, created_at, updated_at, deleted_at) FROM stdin;
1	Metting	metting	0	2026-03-12 04:04:09.094	2026-03-12 04:04:09.094	\N
2	Incentive	incentive	0	2026-03-12 04:04:24.396	2026-03-12 04:04:24.396	\N
3	Conference	conference	0	2026-03-12 04:04:33.672	2026-03-12 04:04:33.672	\N
4	Exhibition	exhibition	0	2026-03-12 04:04:43.107	2026-03-12 04:04:43.107	\N
\.


--
-- Data for Name: gallery_of_works; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gallery_of_works (id, category_id, title, subtitle, description, image_url, slug, display_order, created_by, created_at, updated_at, deleted_at) FROM stdin;
1	1	OUR OCEAN CONFERENCE	Meeting & Conference		https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289209124-3tzwld.png	our-ocean-conference	0	1	2026-03-12 04:20:18.066	2026-03-12 04:20:18.066	\N
2	1	WORLD BANK MFM UNIT RETREAT	Meeting & Gathering		https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289254942-uu49d3.png	world-bank-mfm-unit-retreat	0	1	2026-03-12 04:21:02.618	2026-03-12 04:21:02.618	\N
3	1	Meeting & Conference	ASIAN INITIATIVE MEETING		https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289314239-823p50.webp	meeting-conference	0	1	2026-03-12 04:21:59.222	2026-03-12 04:21:59.222	\N
4	1	PT. SURYA MADISTRINDO	Incentive Trip		https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289341980-scyqm0.webp	pt-surya-madistrindo	0	1	2026-03-12 04:22:27.234	2026-03-12 04:22:27.234	\N
\.


--
-- Data for Name: login_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_attempts (id, identifier, attempted_at) FROM stdin;
\.


--
-- Data for Name: login_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_logs (id, user_id, email, success, failure_reason, ip_address, user_agent, created_at) FROM stdin;
1	1	admin@example.com	f	invalid_password	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-03-13 03:51:10.912
2	1	admin@example.com	t	\N	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-03-13 03:51:15.05
3	1	admin@example.com	t	\N	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-03-13 05:53:20.544
4	1	admin@example.com	f	invalid_password	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-03-13 13:32:05.688
5	1	admin@example.com	t	\N	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-03-13 13:32:09.829
\.


--
-- Data for Name: media_gallery; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media_gallery (id, filename, url, type, original_name, file_size, mime_type, created_by, created_at, deleted_at) FROM stdin;
2	images/1772850784664-1r4ddc.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772850784664-1r4ddc.png	image	Rectangle 243.png	376933	image/png	1	2026-03-07 02:33:06.028	\N
3	images/1772850801856-xq8a12.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772850801856-xq8a12.png	image	Rectangle 243-1.png	679647	image/png	1	2026-03-07 02:33:22.444	\N
4	images/1772850805800-3crjuk.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772850805800-3crjuk.png	image	Rectangle 243-2.png	421229	image/png	1	2026-03-07 02:33:26.147	\N
5	images/1772850864455-fpdy8t.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772850864455-fpdy8t.png	image	Rectangle 245.png	697620	image/png	1	2026-03-07 02:34:24.835	\N
6	images/1772850867319-pqzlkn.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772850867319-pqzlkn.png	image	Rectangle 263.png	871976	image/png	1	2026-03-07 02:34:27.776	\N
7	images/1772850869995-f34fnr.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772850869995-f34fnr.png	image	Rectangle 264.png	741364	image/png	1	2026-03-07 02:34:30.441	\N
8	images/1772859237924-70i5yt.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772859237924-70i5yt.png	image	envato-labs-image-edit (3) 2.png	460512	image/png	1	2026-03-07 04:53:58.775	\N
9	images/1772859241079-o168vy.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772859241079-o168vy.png	image	Rectangle 17.png	386536	image/png	1	2026-03-07 04:54:01.634	\N
10	images/1772859245474-bg7or1.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772859245474-bg7or1.png	image	envato-labs-image-edit (3) 1.png	473292	image/png	1	2026-03-07 04:54:05.853	\N
12	images/1772859514262-mzqkzp.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772859514262-mzqkzp.png	image	Rectangle 246.png	203071	image/png	1	2026-03-07 04:58:34.589	\N
13	images/1772860505814-6klxu4.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860505814-6klxu4.png	image	Rectangle 245.png	1379453	image/png	1	2026-03-07 05:15:06.776	\N
14	images/1772860523140-qakw5e.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860523140-qakw5e.png	image	Rectangle 10.png	134787	image/png	1	2026-03-07 05:15:23.572	\N
15	images/1772860535501-xy5w04.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860535501-xy5w04.png	image	Rectangle 11.png	117942	image/png	1	2026-03-07 05:15:35.881	\N
16	images/1772860544053-76mv7w.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860544053-76mv7w.png	image	Rectangle 12.png	156292	image/png	1	2026-03-07 05:15:44.412	\N
17	images/1772860547849-ahemfx.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860547849-ahemfx.png	image	Rectangle 13.png	153405	image/png	1	2026-03-07 05:15:48.138	\N
18	images/1772860551175-sn4jp6.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860551175-sn4jp6.png	image	Rectangle 18.png	162425	image/png	1	2026-03-07 05:15:51.759	\N
19	images/1772860559611-cs3sk8.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860559611-cs3sk8.png	image	Rectangle 247.png	2304855	image/png	1	2026-03-07 05:16:00.772	\N
20	images/1772860583090-mq1ghm.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860583090-mq1ghm.png	image	envato-labs-image-edit (3) 1.png	211278	image/png	1	2026-03-07 05:16:23.499	\N
21	images/1772860589894-uhb6md.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860589894-uhb6md.png	image	Rectangle 17.png	246529	image/png	1	2026-03-07 05:16:30.359	\N
22	images/1772860593017-lulzaj.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860593017-lulzaj.png	image	envato-labs-image-edit (3) 2.png	175371	image/png	1	2026-03-07 05:16:33.431	\N
1	images/1772850357410-p9qmi7.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772850357410-p9qmi7.png	image	aerial-shot-of-the-komodo-national-park-in-indones-2026-01-08-00-27-30-utc 1 (1).png	3096844	image/png	1	2026-03-07 02:25:58.469	\N
11	images/1772859468139-bo0qsu.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772859468139-bo0qsu.png	image	Rectangle 244.png	1176233	image/png	1	2026-03-07 04:57:48.552	\N
23	images/1773283721645-adc3mv.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773283721645-adc3mv.webp	image	Rectangle 251.webp	44408	image/webp	1	2026-03-12 02:48:43.06	\N
24	images/1773283862884-6eav3p.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773283862884-6eav3p.webp	image	Rectangle 253.webp	156772	image/webp	1	2026-03-12 02:51:03.92	\N
25	images/1773283882452-9uwba8.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773283882452-9uwba8.webp	image	Rectangle 253 (1).webp	234526	image/webp	1	2026-03-12 02:51:23.814	\N
26	images/1773283911239-2r2qij.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773283911239-2r2qij.webp	image	Rectangle 253 (2).webp	71530	image/webp	1	2026-03-12 02:51:53.679	\N
27	images/1773284060706-1scnat.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773284060706-1scnat.webp	image	Rectangle 244.webp	75484	image/webp	1	2026-03-12 02:54:21.827	\N
28	images/1773284103933-ebqrh4.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773284103933-ebqrh4.webp	image	Rectangle 244.webp	75484	image/webp	1	2026-03-12 02:55:05.772	\N
29	images/1773284304677-55lxnv.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773284304677-55lxnv.webp	image	Rectangle 254.webp	25454	image/webp	1	2026-03-12 02:58:25.881	\N
30	images/1773285284215-3zjzuf.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773285284215-3zjzuf.webp	image	Rectangle 10.webp	34924	image/webp	1	2026-03-12 03:14:46.351	\N
31	images/1773285298972-7zvtoc.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773285298972-7zvtoc.webp	image	Rectangle 11.webp	21760	image/webp	1	2026-03-12 03:15:00.053	\N
32	images/1773285311831-ldsex9.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773285311831-ldsex9.webp	image	Rectangle 12.webp	28868	image/webp	1	2026-03-12 03:15:12.966	\N
33	images/1773285330061-sg27vt.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773285330061-sg27vt.webp	image	Rectangle 13.webp	41274	image/webp	1	2026-03-12 03:15:31.174	\N
34	images/1773289209124-3tzwld.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289209124-3tzwld.png	image	Rectangle 269.png	577115	image/png	1	2026-03-12 04:20:11.994	\N
35	images/1773289254942-uu49d3.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289254942-uu49d3.png	image	Rectangle 270.png	674942	image/png	1	2026-03-12 04:20:56.834	\N
36	images/1773289278596-f5tbfd.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289278596-f5tbfd.png	image	Rectangle 271.png	669425	image/png	1	2026-03-12 04:21:19.915	\N
37	images/1773289314239-823p50.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289314239-823p50.webp	image	Rectangle 271.webp	121094	image/webp	1	2026-03-12 04:21:55.293	\N
38	images/1773289341980-scyqm0.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289341980-scyqm0.webp	image	Rectangle 272.webp	114030	image/webp	1	2026-03-12 04:22:24.31	\N
39	images/1773303258336-nohy30.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773303258336-nohy30.webp	image	aerial-shot-of-the-komodo-national-park-in-indones-2026-01-08-00-27-30-utc 1 (1).webp	413198	image/webp	1	2026-03-12 08:14:20.614	\N
40	images/1773303905548-hatvvf.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773303905548-hatvvf.webp	image	Rectangle 285.webp	255728	image/webp	1	2026-03-12 08:25:06.836	\N
41	images/1773328431590-8x5ewz.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773328431590-8x5ewz.webp	image	aerial-shot-of-the-komodo-national-park-in-indones-2026-01-08-00-27-30-utc 1 (1).webp	413198	image/webp	1	2026-03-12 15:13:52.297	\N
42	images/1773328707802-tqpn6d.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773328707802-tqpn6d.webp	image	aerial-shot-of-the-komodo-national-park-in-indones-2026-01-08-00-27-30-utc 1 (1).webp	413198	image/webp	1	2026-03-12 15:18:28.67	\N
43	videos/1773330084431-q30mdp.mp4	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/videos/1773330084431-q30mdp.mp4	video	Travel Hero Video (1) (1).mp4	10743875	video/mp4	1	2026-03-12 15:41:26.44	2026-03-13 13:39:03.815
44	videos/1773357798329-n9fhng.mp4	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/videos/1773357798329-n9fhng.mp4	video	Travel Hero Video (1).mp4	19646180	video/mp4	1	2026-03-12 23:23:26.823	2026-03-13 13:39:06.922
45	images/1773409271550-qwa7is.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773409271550-qwa7is.webp	image	Rectangle 253 (1).webp	234526	image/webp	1	2026-03-13 13:41:12.586	\N
46	videos/1773409323446-kwa68g.mp4	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/videos/1773409323446-kwa68g.mp4	video	Travel Hero Video (1).mp4	16647563	video/mp4	1	2026-03-13 13:42:09.339	\N
\.


--
-- Data for Name: navigation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.navigation (id, label, url, parent_id, "order", icon, target, is_active, created_at, updated_at, deleted_at, platform) FROM stdin;
1	Indonesia Journal	/	\N	0		_self	t	2026-03-05 06:10:50.354	2026-03-05 06:10:50.354	\N	desktop
2	Portfolio	/portfolio	\N	0		_self	t	2026-03-05 06:11:03.261	2026-03-05 06:11:03.261	\N	desktop
3	Sustainable Impact	/sustainable-impact	\N	0		_self	t	2026-03-05 06:11:22.961	2026-03-05 06:11:22.961	\N	desktop
4	Let's Connected	/contact-us	\N	0		_self	t	2026-03-05 06:11:29.986	2026-03-12 14:24:39.408	\N	desktop
5	Our Inspiration	/	\N	0		_self	t	2026-03-13 19:20:08.913	2026-03-13 19:20:08.913	\N	mobile
6	Prestige Event	/	\N	0		_self	t	2026-03-13 19:20:18.326	2026-03-13 19:20:18.326	\N	mobile
7	Signature Voyage	/	\N	0		_self	t	2026-03-13 19:20:28.993	2026-03-13 19:20:28.993	\N	mobile
8	Wellness Escape	/	\N	0		_self	t	2026-03-13 19:20:40.815	2026-03-13 19:20:40.815	\N	mobile
9	Curated Experience	/	\N	0		_self	t	2026-03-13 19:20:49.645	2026-03-13 19:20:49.645	\N	mobile
10	Indonesia Journal	/	\N	0		_self	t	2026-03-13 19:21:00.388	2026-03-13 19:21:00.388	\N	mobile
11	Portfolio	/	\N	0		_self	t	2026-03-13 19:21:09.303	2026-03-13 19:21:09.303	\N	mobile
12	Sustainable Impact	/	\N	0		_self	t	2026-03-13 19:21:20.351	2026-03-13 19:21:20.351	\N	mobile
\.


--
-- Data for Name: page_sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.page_sections (id, page_name, page_slug, page_data, created_by, created_at, updated_at, deleted_at) FROM stdin;
3	Our Inspiration	our-inspiration	{"hero":{"title":"BOARD LETTER","description":"","background":"https://cdn.takshaka.id/images/1772859468139-bo0qsu.png"},"boardLetter":{"imageUrl":"https://cdn.takshaka.id/images/1772859514262-mzqkzp.png","paragraphs":[{"null":"At Takshaka, we believe that true leadership is defined by the ability to adapt and innovate in an ever-evolving landscape. This past year has been a testament to our resilience and our unwavering commitment to excellence."},{"null":"Our focus remains clear: to drive sustainable growth while delivering exceptional value to our clients and partners. By integrating forward-thinking strategies with a dedicated team, Takshaka is not just keeping pace with the industry—we are setting the standard for the future."},{"null":"We thank you for your continued trust as we embark on this next chapter of our journey."}],"signatureName":"Leadership Team","signatureTitle":"Taksaka"},"fullwidthImage":{"src":"https://cdn.takshaka.id/images/1772860505814-6klxu4.png","alt":"Inspiration"},"takskaWay":{"sectionTitle":"TAKSHAKA WAY","items":[{"id":"authenticity","title":"AUTHENTICITY","imageUrl":"https://cdn.takshaka.id/images/1772860523140-qakw5e.png"},{"id":"transformation","title":"TRANSFORMATION","imageUrl":"https://cdn.takshaka.id/images/1772860535501-xy5w04.png"},{"id":"sustainability","title":"SUSTAINABILITY","imageUrl":"https://cdn.takshaka.id/images/1772860544053-76mv7w.png"},{"id":"harmony","title":"HARMONY","imageUrl":"https://cdn.takshaka.id/images/1772860547849-ahemfx.png"},{"id":"excellence","title":"EXCELLENCE\\nIN EXPERIENCE","imageUrl":"https://cdn.takshaka.id/images/1772860551175-sn4jp6.png"}]},"brandStory":{"backgroundImage":"https://cdn.takshaka.id/images/1772860559611-cs3sk8.png","sectionTitle":"BRAND STORY","items":[{"id":"origin","title":"THE ORIGIN","description":"Taksaka draws from a rich cultural heritage, weaving together ancestral wisdom with contemporary consciousness to create transformative journeys.","imageUrl":"https://cdn.takshaka.id/images/1772860583090-mq1ghm.png"},{"id":"myth","title":"MYTH & SYMBOL","description":"More than mythology, Taksaka embodies the sacred connection between the ethereal and the spiritual, honoring the timeless and cherished traditions.","imageUrl":"https://cdn.takshaka.id/images/1772860589894-uhb6md.png"},{"id":"meaning","title":"MEANING","description":"At its heart, Taksaka seeks to awaken collective revelation advancing consciousness, responsibility, and renewal to transform experience.","imageUrl":"https://cdn.takshaka.id/images/1772860593017-lulzaj.png"}]},"timeline":{"sectionTitle":"SPIRITUAL JOURNEY","items":[{"id":"mount-agung","title":"MOUNT AGUNG","description":"The axis of spiritual elevation."},{"id":"cloud","title":"CLOUD","description":"Aspiration beyond boundaries."},{"id":"air","title":"AIR","description":"Invisible force that connects all."},{"id":"fire","title":"FIRE","description":"Energy of transformation."},{"id":"water","title":"WATER","description":"Balance through adaptability."},{"id":"night-queen","title":"NIGHT QUEEN","description":"Timeless victory and grace."},{"id":"dragon","title":"DRAGON","description":"Directional growth and evolution."},{"id":"dragon-wing","title":"DRAGON WING","description":"Transcendental strength."},{"id":"gold-crown","title":"GOLD CROWN","description":"Illuminated authority."},{"id":"circle","title":"CIRCLE","description":"Eternal unity."},{"id":"gold-jewels","title":"GOLD JEWELS","description":"Inner prosperity and clarity."}]}}	1	2026-03-06 14:27:23.826482	2026-03-12 10:02:39.043	\N
5	Prestige Events	prestige-events	{"hero":{"title":"PRESTIGE EVENTS","description":"IDEAS DEMAND WORTHY STAGES","background":"https://cdn.takshaka.id/images/1773284103933-ebqrh4.webp"},"heroContent":{"backgroundImage":"https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80","alt":"Prestige Event Stage","badge":"CONFERENCE & SUMMIT","heading":"IDEAS DEMAND\\nWORTHY STAGES","description":"The world's boldest ideas deserve a stage to match, and TakskaEvents creates experiences that turn conversation into transformation. Every event unfolds as a carefully choreographed masterpiece—from intimate roundtables to grand summits with thousands. We believe in creating powerful moments of connection and impact while building global peer communities.","slides":[{"backgroundImage":"https://cdn.takshaka.id/images/1773283721645-adc3mv.webp","alt":"Ideas Demand Worthy Stages","badge":"Conference & Summit","heading":"Ideas Demand Worthy Stages","description":"The world’s boldest ideas deserve a stage to match, and Takshaka curates conferences and summits where intellectual rigor meets elevated experience, overseeing every detail from venue and keynote orchestration to world-class production and seamless global guest management."},{"backgroundImage":"https://cdn.takshaka.id/images/1773283862884-6eav3p.webp","alt":"Tables Set with Gold and Memory","badge":"Reception & Gala","heading":"Tables Set with Gold and Memory","description":"A Takshaka gala dinner is not a meal but a meticulously composed sensory narrative, set in extraordinary locations, crafted with Indonesia’s finest culinary and cultural talents, and executed with obsessive precision to deliver an unforgettable experience."},{"backgroundImage":"https://cdn.takshaka.id/images/1773283882452-9uwba8.webp","alt":"Reward the Extraordinary with the Extraordinary","badge":"Incentive & Gathering","heading":"Reward the Extraordinary with the Extraordinary","description":"Your highest performers deserve more than recognition, they deserve an experience that becomes the benchmark for reward. Takshaka incentive programs deliver bespoke journeys, blending private access, curated cultural encounters, and seamless, understated luxury, designed for lasting impact and memory."},{"backgroundImage":"https://cdn.takshaka.id/images/1773283911239-2r2qij.webp","alt":"Your Debut Deserves Dragon Fire","badge":"Launching & Exhibition","heading":"Your Debut Deserves Dragon Fire","description":"When a brand launches in Indonesia or steps onto the global stage, the moment demands precision and theatrical impact. Takshaka crafts product launches and brand activations that spark conversation, earn coverage, and deliver reveal moments that are architecturally and dramatically flawless."}]},"twoColumn":{"title":"WHERE BUSINESS","titleItalic":"TRANSFORM INTO","titleBold":"EXPERIENCE","description":"When business gathers in the right setting, shaped by clear intention, it doesn’t just meet objectives, it transcends them.\\n\\nThe world’s most forward-thinking organizations choose Takshaka to ensure their people return transformed and their brand leaves an impression that endures long after the conference ends.","imageUrl":"https://cdn.takshaka.id/images/1773284304677-55lxnv.webp"},"imageGallery":{"images":[{"id":"1","src":"https://cdn.takshaka.id/images/1773285284215-3zjzuf.webp","alt":"Mountain landscape","caption":"UNLOCK TEAM POTENTIAL WITH CULTURE","link":"/"},{"id":"2","src":"https://cdn.takshaka.id/images/1773285298972-7zvtoc.webp","alt":"high impact conference & meeting","caption":"high impact conference & meeting","link":"/"},{"id":"3","src":"https://cdn.takshaka.id/images/1773285311831-ldsex9.webp","alt":"UNLOCK INSPIRATION FROM LOCAL CULTURE","caption":"UNLOCK INSPIRATION FROM LOCAL CULTURE","link":"/"},{"id":"4","src":"https://cdn.takshaka.id/images/1773285330061-sg27vt.webp","alt":"IMPACTFUL ENVIRONMENTAL EVENTS","caption":"IMPACTFUL ENVIRONMENTAL EVENTS","link":"/"}]},"whatMakesUsDifferent":{"title":"WHAT MAKE US DIFFERENT'S?","items":[{"title":"Rooted\\nin Culture","description":"We blend local wisdom into modern, meaningful formats that feel fresh and relevant."},{"title":"All-in-One Service","description":"From travel, design, content, logistics, to wellness, all in sync. No need to coordinate multiple vendors."},{"title":"Meaning in Every Moment","description":"From how guests are welcomed to what they feel when they leave, everything is intentional."},{"title":"Sustainability & Inclusion in Practice","description":"From accessible setups to eco-friendly event kits, we embed values into real details that matter, not just as decoration."}]}}	1	2026-03-06 21:48:32.428145	2026-03-12 14:10:54.642	\N
6	Signature Voyage	signature-voyage	{"hero":{"title":"SIGNATURE VOYAGE","description":"CURATED TRAVEL EXPERIENCES THAT TRANSFORM","background":"https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80"},"topDestinations":{"title":"TOP DESTINATION AROUND INDONESIA","subtitle":"A curated collection of Indonesia's most extraordinary destinations, where nature, culture, and refined travel experiences converge.","destinations":[{"title":"BALI","subtitle":"Indonesian most iconic island, where sacred culture meets luxury hospitality","description":"Bali enchants with its temples, rice terraces, and spiritual traditions. Experience ancient ceremonies, wellness retreats, and pristine beaches in harmony with Balinese hospitality.","image":"https://cdn.takshaka.id/images/1773303905548-hatvvf.webp"},{"title":"LOMBOK","subtitle":"A serene island escape defined by pristine beaches and underwater treasures","description":"A serene island escape defined by pristine beaches and underwater treasures. Remote beauty meets sustainable luxury in this untouched paradise.","image":"https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80"},{"title":"LABUAN BAJO","subtitle":"Gateway to Komodo National Park and extraordinary marine adventures","description":"We curate gateway to Komodo National Park and extraordinary marine adventures. Dive alongside majestic manta rays and explore volcanic islands.","image":"https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&q=80"},{"title":"LIKUPANG","subtitle":"A tranquil North Sulawesi retreat favored by pristine beaches and underwater wonders","description":"A tranquil North Sulawesi retreat favored by pristine beaches and underwater wonders. Pristine dive sites and white sand beaches.","image":"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"},{"title":"MOROTAI","subtitle":"A coastal island frontier offering crystal waters, rich history, and rare exclusivity","description":"A coastal island frontier offering crystal waters, rich history, and rare exclusivity. Experience untouched natural beauty and cultural authenticity.","image":"https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80"},{"title":"WAKATOBI","subtitle":"A world-renowned marine sanctuary celebrated for extraordinary diving and biodiversity","description":"A world-renowned marine sanctuary celebrated for extraordinary diving and biodiversity. Premier destination for underwater exploration.","image":"https://images.unsplash.com/photo-1451108636100-e071f88e0e7e?w=600&q=80"},{"title":"RAJA AMPAT","subtitle":"An iconic archipelago of emerald islands about the richest coral and marine life on earth","description":"An iconic archipelago of emerald islands about the richest coral and marine life on earth. World-class diving destination.","image":"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80"},{"title":"BANGKA BELITONG","subtitle":"A coastal paradise of pristine islands and luminous white-sand beaches","description":"A coastal paradise of pristine islands and luminous white-sand beaches. Perfect for beach lovers and island hoppers.","image":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"}]}}	1	2026-03-12 07:37:31.865316	2026-03-12 08:25:13.579	\N
2	Homepage	home	{"hero":{"title":"SIGNATURE VOYAGE","subtitle":"Our Curated Travel Experience \\nwith Meaningful Impact","background":"https://cdn.takshaka.id/videos/1773357798329-n9fhng.mp4","contents":[{"title":"Signature Voyage","description":"Our Curated Travel Experience with Meaningful Impact","background":"https://cdn.takshaka.id/videos/1773409323446-kwa68g.mp4"},{"title":"Signature Voyage","description":"Our Curated Travel Experience with Meaningful Impact","background":"https://cdn.takshaka.id/images/1773409271550-qwa7is.webp"}]},"threeItemSection":{"heading":"Rooted in cultural wisdom, we curate bespoke experiences that are meaningful, transformative, and timeless.","images":[{"image":"https://cdn.takshaka.id/images/1772850784664-1r4ddc.png","alt":"Impactful Experience","title":"Impactful Experience","description":"Every journey designed with intention, precision, and meaning."},{"image":"https://cdn.takshaka.id/images/1772850801856-xq8a12.png","alt":"Cultural Wisdom","title":"Cultural Wisdom","description":"Inspired by the depth of cultural wisdom, we design experiences that transcend beauty, harmony, and transformation."},{"image":"https://cdn.takshaka.id/images/1772850805800-3crjuk.png","alt":"Bespoke Services","title":"Bespoke Services","description":"We curate bespoke experiences, meticulously crafted for each client, transforming vision into moments of lasting meaning."}]},"imagesSection":{"images":[{"src":"https://cdn.takshaka.id/images/1772850864455-fpdy8t.png","alt":"Indonesian cultural heritage"},{"src":"https://cdn.takshaka.id/images/1772850867319-pqzlkn.png","alt":"Indonesian traditions and arts"},{"src":"https://cdn.takshaka.id/images/1772850869995-f34fnr.png","alt":"Indonesian immersive experiences"}],"description":"A curated collection of Indonesia’s most inspiring destinations and immersive experiences. From cultural heritage and gastronomy to marine exploration, wildlife, and adventure, each journey is thoughtfully designed to reveal the richness of Indonesia while creating meaningful and memorable moments."},"curatedExperiences":{"tabs":[{"id":"tab-1","label":"General","items":[{"id":"1","title":"lorem ipsum dolor sit amet Edit","description":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum","image":""}]}],"selectedCategoryIds":[2,3,5,4,6]},"experiencesShared":{"experiences":[{"id":"1","title":"YACHT BALI","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu condimentum arcu, a fermentum magna. Donec rutrum quis massa sit amet viverra. Integer pretium nunc ut diam tempus feugiat.","image":"https://cdn.takshaka.id/images/1772859237924-70i5yt.png"},{"id":"2","title":"GRAND CANYON","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu condimentum arcu, a fermentum magna. Donec rutrum quis massa sit amet viverra. Integer pretium nunc ut diam tempus feugiat.","image":"https://cdn.takshaka.id/images/1772859241079-o168vy.png"},{"id":"3","title":"PHI PHI ISLAND","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu condimentum arcu, a fermentum magna. Donec rutrum quis massa sit amet viverra. Integer pretium nunc ut diam tempus feugiat.","image":"https://cdn.takshaka.id/images/1772859245474-bg7or1.png"}]}}	1	2026-03-06 07:05:44.27368	2026-03-13 13:42:17.986	\N
\.


--
-- Data for Name: page_views; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.page_views (id, page_slug, page_title, visitor_id, referrer, user_agent, ip_address, created_at) FROM stdin;
1	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-10 22:18:20.398
2	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-11 13:22:21.673
3	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-11 13:48:30.038
4	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-11 13:48:36.952
5	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-11 13:48:36.955
6	/	Home	2ecea537a54c33ea169f774420db3e64	\N	vercel-screenshot/1.0	146.190.133.82	2026-03-11 14:02:01.721
7	/	Home	656c15f17bd7ce7e83a35253c2cb71d0	\N	vercel-screenshot/1.0	137.184.37.40	2026-03-11 14:02:03.596
8	/	Home	b9f3348b2b4e6c98e046228f2d9b68e0	https://takshaka-project-fj6we71k9-takshakabaliwebsite-6496s-projects.vercel.app/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	103.171.146.56	2026-03-11 14:02:28.521
9	/	Home	2af78c7389a361b6f8bfaded74b2831f	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1	104.22.17.121	2026-03-11 14:24:41.609
10	/	Home	143f5035b2316b60391619283265e65e	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1	162.159.104.152	2026-03-11 14:24:41.606
11	/	Home	a49536e036865c053464536e88eb811f	https://www.google.com/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	172.69.194.242	2026-03-11 16:21:33.858
12	/	Home	e7a848eff7d785f79db73ab2e77980a7	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36	162.158.38.194	2026-03-11 17:24:01.05
13	/	Home	2a9178240aa698ac67dd2c5ea4988c9b	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.7680.71 Safari/537.36	104.23.160.42	2026-03-11 17:58:04.266
14	/	Home	5223c35fd6c9cec41bfb8390854fffde	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1	108.162.245.232	2026-03-11 17:58:12.219
15	/	Home	0a1f58a867b8dbed75db578652a0e79c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.62	2026-03-11 19:07:04.473
16	/our-inspiration	Our Inspiration	590bbe3676d9b99808de5f97f3d3e060	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.63	2026-03-11 19:07:11.495
17	/	Home	590bbe3676d9b99808de5f97f3d3e060	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.63	2026-03-11 19:07:16.96
18	/prestige-event	Prestige Events	0a1f58a867b8dbed75db578652a0e79c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.62	2026-03-11 19:07:22.277
19	/our-inspiration	Our Inspiration	0a1f58a867b8dbed75db578652a0e79c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.62	2026-03-11 19:07:28.784
20	/	Home	703c916427175df8d52db5f6452665ee	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.190.18	2026-03-11 19:16:20.398
21	/	Home	703c916427175df8d52db5f6452665ee	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.190.18	2026-03-11 19:16:22.728
22	/	Home	703c916427175df8d52db5f6452665ee	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.190.18	2026-03-11 19:16:23.522
23	/	Home	703c916427175df8d52db5f6452665ee	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.190.18	2026-03-11 19:16:24.255
24	/	Home	703c916427175df8d52db5f6452665ee	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.190.18	2026-03-11 19:16:25.294
25	/	Home	533bdee2c407d966a6d5269167173d29	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-12 01:29:01.837
26	/prestige-event	Prestige Events	77fb187d3f15bad35c90a7f0f21b726f	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.146	2026-03-12 01:29:30.349
27	/our-inspiration	Our Inspiration	533bdee2c407d966a6d5269167173d29	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-12 01:29:47.431
28	/	Home	77fb187d3f15bad35c90a7f0f21b726f	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.146	2026-03-12 01:29:54.266
29	/	Home	77fb187d3f15bad35c90a7f0f21b726f	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.146	2026-03-12 01:29:57.749
30	/	Home	1e89ccafd6de8ca01442e70f7f1e853b	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15	104.23.175.132	2026-03-12 02:06:39.865
31	/	Home	8d76ff55ce7b21ace96d1b2beacaac54	https://www.google.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15	104.23.175.146	2026-03-12 02:07:03.271
32	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:25:52.116
33	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:26:05.538
34	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:26:05.54
35	/	Home	158403fc36a9c85f172f7c0f84bc2df9	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.67	2026-03-12 02:26:33.958
36	/our-inspiration	Our Inspiration	158403fc36a9c85f172f7c0f84bc2df9	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.67	2026-03-12 02:26:34.299
37	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:26:39.497
38	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:27:08.642
39	/	Home	158403fc36a9c85f172f7c0f84bc2df9	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.67	2026-03-12 02:27:14.921
40	/our-inspiration	Our Inspiration	158403fc36a9c85f172f7c0f84bc2df9	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.67	2026-03-12 02:27:16.53
41	/our-inspiration	Our Inspiration	158403fc36a9c85f172f7c0f84bc2df9	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.67	2026-03-12 02:27:19.457
42	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:28:24.14
43	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:31:21.996
44	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:31:47.357
45	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:31:47.359
46	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:32:16.128
47	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:35:52.708
48	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:37:40.542
49	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:37:48.893
50	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:49:15.76
51	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:52:11.695
52	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:54:27.554
53	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:55:13.892
54	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:58:53.71
55	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 03:15:40.529
56	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 03:16:57.485
57	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 03:16:59.977
58	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 03:25:45.61
59	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 04:23:07.33
60	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 04:23:10.789
61	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 04:23:10.792
62	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 04:26:23.762
63	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 04:31:18.879
64	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 04:49:24.33
65	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 04:49:24.337
66	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 04:49:25.226
67	/	Home	20b7f9b37830dcfa49f33a0cf86265f7	\N	vercel-screenshot/1.0	137.184.12.43	2026-03-12 04:52:04.065
68	/	Home	8ed7c16d68e5569b61519389ad1b5811	\N	vercel-screenshot/1.0	64.23.178.209	2026-03-12 04:52:04.199
69	/	Home	77703603fe774f95cf5a6f3aa4d563d0	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.97	2026-03-12 04:52:54.202
70	/	Home	606106c53fc4469b816b1048c5d6ada3	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.66	2026-03-12 04:53:03.25
71	/prestige-event	Prestige Events	606106c53fc4469b816b1048c5d6ada3	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.66	2026-03-12 04:53:04.624
72	/	Home	120f8ee4fbd01059045c153ac975b829	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.132 Safari/537.36	172.68.27.95	2026-03-12 05:30:19.82
73	/	Home	3916615f0d86ee8a7c4547a2b4acc878	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.68.164.119	2026-03-12 06:06:13.991
74	/prestige-event	Prestige Events	e7a1e81b715a820ccf9c61635f71a239	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.71.81.47	2026-03-12 06:13:51.996
75	/prestige-event	Prestige Events	e7a1e81b715a820ccf9c61635f71a239	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.71.81.47	2026-03-12 06:13:54.188
76	/	Home	5cecfcbda5f2e1ba94edf1c5dcbfbff9	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.224	2026-03-12 07:10:20.325
77	/	Home	5cecfcbda5f2e1ba94edf1c5dcbfbff9	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.224	2026-03-12 07:10:22.452
78	/	Home	5cecfcbda5f2e1ba94edf1c5dcbfbff9	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.224	2026-03-12 07:10:54.177
79	/	Home	5cecfcbda5f2e1ba94edf1c5dcbfbff9	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.224	2026-03-12 07:10:58.03
80	/prestige-event	Prestige Events	5cecfcbda5f2e1ba94edf1c5dcbfbff9	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.224	2026-03-12 07:10:59.156
81	/	Home	5cecfcbda5f2e1ba94edf1c5dcbfbff9	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.224	2026-03-12 07:11:21.54
82	/our-inspiration	Our Inspiration	5cecfcbda5f2e1ba94edf1c5dcbfbff9	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.224	2026-03-12 07:11:25.933
83	/	Home	5febf67f00cc117b1b2b135827041e4f	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.159.102.149	2026-03-12 07:30:53.618
84	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:31:48.304
85	/	Home	dd0ceab340d06d90772cbf98ee67f36f	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.88.120	2026-03-12 07:35:23.735
86	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:37:36.311
87	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:37:45.62
88	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:37:45.622
89	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:37:50.581
90	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:37:50.583
91	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:38:24.148
92	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:38:41.421
93	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:38:57.029
94	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:38:57.032
96	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:43:05.555
95	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:43:05.558
97	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:43:11.273
98	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:45:25.219
99	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:00:48.986
100	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:00:52.729
101	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:00:52.733
102	/	Home	82fcd9b928326cea6501d2bc6e45ec12	\N	Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36	162.158.95.141	2026-03-12 08:02:13.577
103	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:06:34.087
104	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:18:33.181
105	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:18:37.195
106	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:18:37.198
107	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:25:18.945
108	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:32:00.452
109	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:35:41.724
110	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:37:26.179
111	/	Home	5c7d7ba30d6b0fae25348a5e6613d8df	\N	vercel-screenshot/1.0	143.198.63.243	2026-03-12 08:44:36.937
112	/	Home	656c15f17bd7ce7e83a35253c2cb71d0	\N	vercel-screenshot/1.0	137.184.37.40	2026-03-12 08:44:37.55
113	/	Home	5e261d12c2cca4e1cf0a2c335dee6132	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.22.66.54	2026-03-12 08:57:36.372
114	/signature-voyage	Signature Voyage	258896a5e944ab66e57bd999418b0c71	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.22.66.184	2026-03-12 08:57:54.875
115	/	Home	65af2fd5fa856771509ddf0798f74de7	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.23.175.147	2026-03-12 08:59:31.932
116	/our-inspiration	Our Inspiration	533bdee2c407d966a6d5269167173d29	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-12 09:01:00.957
117	/our-inspiration	Our Inspiration	533bdee2c407d966a6d5269167173d29	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-12 09:01:02.724
118	/signature-voyage	Signature Voyage	533bdee2c407d966a6d5269167173d29	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-12 09:02:07.026
119	/prestige-event	Prestige Events	533bdee2c407d966a6d5269167173d29	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-12 09:02:09.115
120	/	Home	533bdee2c407d966a6d5269167173d29	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-12 09:02:32.749
121	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 09:05:39.807
122	/prestige-event	Prestige Events	f26b7c7028ada054a4d0308a50e3bd1b	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.22.66.184	2026-03-12 09:15:39.616
123	/signature-voyage	Signature Voyage	f26b7c7028ada054a4d0308a50e3bd1b	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.22.66.184	2026-03-12 09:15:41.227
124	/prestige-event	Prestige Events	eeeff2ff4d225f276d599b69de081eaa	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.70.188.68	2026-03-12 09:16:32.59
125	/prestige-event	Prestige Events	65af2fd5fa856771509ddf0798f74de7	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.23.175.147	2026-03-12 09:17:58.258
126	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 09:18:46.211
127	/	Home	d21202af1b1aa8f74c5d8f907832acbb	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.71.124.225	2026-03-12 09:19:20.769
128	/our-inspiration	Our Inspiration	dc8297ced045cba803aecc186ae2273e	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.88.120	2026-03-12 09:19:27.375
129	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 09:20:40.41
130	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 09:20:47.004
131	/	Home	2ecea537a54c33ea169f774420db3e64	\N	vercel-screenshot/1.0	146.190.133.82	2026-03-12 09:23:46.391
132	/	Home	a2d288b2eddaa7773355618da8ec1327	\N	vercel-screenshot/1.0	143.110.147.18	2026-03-12 09:23:46.993
133	/	Home	9f12d59870d8e4f628ba09adee695550	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.70.189.97	2026-03-12 09:24:49.72
134	/our-inspiration	Our Inspiration	9f12d59870d8e4f628ba09adee695550	https://www.takshaka.id/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.70.189.97	2026-03-12 09:24:54.907
135	/	Home	65af2fd5fa856771509ddf0798f74de7	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.23.175.147	2026-03-12 09:41:04.347
136	/	Home	e3865ed28c9598b42e26b189dda43ec0	https://www.takshaka.id/our-inspiration	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.68.164.119	2026-03-12 09:42:39.245
137	/	Home	29d5a21600fb713055fd320b1119edc1	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	172.70.248.41	2026-03-12 09:46:20.574
138	/	Home	2090bd6d1b1e943eab5fa1ca1e3b4e76	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	172.71.148.122	2026-03-12 09:46:29.499
139	/	Home	9066042fc90b0b1658cf09f1ae0004e2	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:55:05.282
140	/	Home	9066042fc90b0b1658cf09f1ae0004e2	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:55:40.516
141	/signature-voyage	Signature Voyage	9066042fc90b0b1658cf09f1ae0004e2	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:55:52.621
142	/	Home	9066042fc90b0b1658cf09f1ae0004e2	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:56:10.154
143	/signature-voyage	Signature Voyage	9066042fc90b0b1658cf09f1ae0004e2	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:56:13.079
144	/	Home	9066042fc90b0b1658cf09f1ae0004e2	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:56:16.675
145	/signature-voyage	Signature Voyage	9066042fc90b0b1658cf09f1ae0004e2	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:56:17.441
146	/	Home	9066042fc90b0b1658cf09f1ae0004e2	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:56:23.2
147	/prestige-event	Prestige Events	9066042fc90b0b1658cf09f1ae0004e2	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:56:24.1
148	/our-inspiration	Our Inspiration	9066042fc90b0b1658cf09f1ae0004e2	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:56:37.263
149	/	Home	0dc3d0464a39e72fe843ec9b1a9aa843	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.69.165.42	2026-03-12 09:57:14.792
150	/	Home	b498251159d50f20c65b209251f0f2dc	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.71.124.225	2026-03-12 09:57:28.345
151	/	Home	b0e709518d972e70890db9ad626b2fda	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.165.42	2026-03-12 09:57:48.028
152	/	Home	b0e709518d972e70890db9ad626b2fda	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.165.42	2026-03-12 09:59:44.422
153	/our-inspiration	Our Inspiration	b0e709518d972e70890db9ad626b2fda	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.165.42	2026-03-12 09:59:45.97
154	/our-inspiration	Our Inspiration	b0e709518d972e70890db9ad626b2fda	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.165.42	2026-03-12 09:59:51.484
155	/our-inspiration	Our Inspiration	b0e709518d972e70890db9ad626b2fda	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.165.42	2026-03-12 10:00:18.228
156	/our-inspiration	Our Inspiration	31b18f69ccff315c83acdc705f32ef2c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.166.117	2026-03-12 10:01:16.214
157	/our-inspiration	Our Inspiration	31b18f69ccff315c83acdc705f32ef2c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.166.117	2026-03-12 10:02:18.074
158	/our-inspiration	Our Inspiration	31b18f69ccff315c83acdc705f32ef2c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.166.117	2026-03-12 10:02:23.588
159	/our-inspiration	Our Inspiration	31b18f69ccff315c83acdc705f32ef2c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.166.117	2026-03-12 10:02:56.329
160	/our-inspiration	Our Inspiration	31b18f69ccff315c83acdc705f32ef2c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.166.117	2026-03-12 10:02:57.085
161	/our-inspiration	Our Inspiration	31b18f69ccff315c83acdc705f32ef2c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.166.117	2026-03-12 10:02:57.755
162	/	Home	4339b8c1f32ff9d0bfa80529007d8a62	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7.3 Mobile/15E148 Safari/604.1	172.69.166.117	2026-03-12 10:05:07.24
163	/our-inspiration	Our Inspiration	4339b8c1f32ff9d0bfa80529007d8a62	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7.3 Mobile/15E148 Safari/604.1	172.69.166.117	2026-03-12 10:05:08.61
164	/our-inspiration	Our Inspiration	fcb7b9007c2d91649ed142f3a76816e6	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7.3 Mobile/15E148 Safari/604.1	172.71.214.95	2026-03-12 12:46:11.055
165	/	Home	182469a7505c0260f1e1f09caf40755b	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.132	2026-03-12 14:07:12.228
166	/signature-voyage	Signature Voyage	182469a7505c0260f1e1f09caf40755b	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.132	2026-03-12 14:07:12.658
167	/prestige-event	Prestige Events	8031e83149b030dc445a606263627699	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.146	2026-03-12 14:07:14.703
168	/our-inspiration	Our Inspiration	8031e83149b030dc445a606263627699	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.146	2026-03-12 14:07:23.37
169	/signature-voyage	Signature Voyage	8031e83149b030dc445a606263627699	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.146	2026-03-12 14:07:27.351
170	/prestige-event	Prestige Events	8031e83149b030dc445a606263627699	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.146	2026-03-12 14:07:36.015
171	/	Home	8031e83149b030dc445a606263627699	https://www.takshaka.id/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.146	2026-03-12 14:07:43.658
172	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:09:41.13
173	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:09:42.99
174	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:09:42.993
175	/	Home	8031e83149b030dc445a606263627699	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.146	2026-03-12 14:09:57.069
176	/	Home	015b75bd46b704e798c19d67e202ef1a	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.207	2026-03-12 14:10:11.227
177	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:11:00.895
178	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:11:00.891
179	/	Home	b0f782072b6f243232f3098b75c3a3fb	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.147	2026-03-12 14:11:08.817
180	/our-inspiration	Our Inspiration	8031e83149b030dc445a606263627699	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.146	2026-03-12 14:11:12.182
181	/prestige-event	Prestige Events	b0f782072b6f243232f3098b75c3a3fb	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.147	2026-03-12 14:11:18.646
182	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:24:21.169
183	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:24:42.712
184	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:53:19.047
185	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:53:19.053
186	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 15:19:08.06
187	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 15:41:47.155
188	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 23:23:37.827
189	/	Home	2d8fc9b5725e30f7a3ca1ac3712c86bd	\N	vercel-screenshot/1.0	165.232.154.185	2026-03-12 23:25:50.176
190	/	Home	20b7f9b37830dcfa49f33a0cf86265f7	\N	vercel-screenshot/1.0	137.184.12.43	2026-03-12 23:25:50.718
191	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 23:52:22.088
192	/	Home	f59427535db2a7f3b51594ad148dc89e	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	104.23.175.146	2026-03-13 00:48:49.934
193	/our-inspiration	Our Inspiration	c276fba0efc452afea59187df83d1b7f	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.81.48	2026-03-13 00:49:36.328
194	/signature-voyage	Signature Voyage	b328e658ca5fe4c2f817c9b0efd25352	https://www.takshaka.id/our-inspiration	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.70.93.16	2026-03-13 00:50:11.611
195	/	Home	b328e658ca5fe4c2f817c9b0efd25352	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.70.93.16	2026-03-13 00:50:36.818
196	/	Home	17c181dd0b48a2659e78be14a7bd8429	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.70.93.16	2026-03-13 00:50:43.686
197	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 01:33:49.801
198	/	Home	083d490a4d2636ec046fb8c27bbf26ca	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.189.89	2026-03-13 02:01:25.632
199	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:26:26.398
200	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:26:26.4
201	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:26:30.635
202	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:26:30.637
203	/blog	Blog & Artikel	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:27:29.517
204	/blog	Blog & Artikel	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:27:29.514
205	/our-inspiration	Our Inspiration	65348e3778ac5392c0cf5d9e3838c336	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.190.18	2026-03-13 02:36:18.648
206	/signature-voyage	Signature Voyage	65348e3778ac5392c0cf5d9e3838c336	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.190.18	2026-03-13 02:36:26.265
207	/our-inspiration	Our Inspiration	65348e3778ac5392c0cf5d9e3838c336	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.190.18	2026-03-13 02:36:36.876
208	/	Home	65348e3778ac5392c0cf5d9e3838c336	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.190.18	2026-03-13 02:36:37.647
209	/	Home	19ed397c5af18eb744d6e2d3839266ff	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	108.162.227.37	2026-03-13 02:38:33.814
210	/	Home	656c15f17bd7ce7e83a35253c2cb71d0	\N	vercel-screenshot/1.0	137.184.37.40	2026-03-13 02:40:03.281
211	/	Home	6eca5866d975f8dd8512dfa04b805286	\N	vercel-screenshot/1.0	137.184.85.43	2026-03-13 02:40:03.814
212	/	Home	bac9d978a12c3988443c54e3cb57472b	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.71.124.224	2026-03-13 02:43:38.524
213	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:44:04.487
214	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:44:04.49
215	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:44:08.524
216	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:44:08.528
217	/	Home	6eca5866d975f8dd8512dfa04b805286	\N	vercel-screenshot/1.0	137.184.85.43	2026-03-13 02:52:31.703
218	/	Home	656c15f17bd7ce7e83a35253c2cb71d0	\N	vercel-screenshot/1.0	137.184.37.40	2026-03-13 02:52:31.752
219	/	Home	3819f4eaeae1fac71f2a9e54285aedf0	https://vercel.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.71.82.15	2026-03-13 02:53:36.896
220	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 03:27:46.394
221	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 03:28:17.135
222	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 03:28:17.138
223	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 03:28:21.169
224	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 03:28:21.171
225	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 03:28:34.117
226	/	Home	565b2d351206e4bd41afc6598e271d18	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	104.22.66.185	2026-03-13 03:46:32.611
227	/	Home	e607c3d5ff36bbc7d295f2f94f034ceb	https://www.google.com/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.69.166.116	2026-03-13 04:04:56.563
228	/	Home	cbaf668c4449055da9781ae2eb87e6b5	https://www.google.com/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.70.108.174	2026-03-13 04:27:11.419
229	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 04:46:50.14
230	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 04:49:12.451
231	/	Home	1a40847b4e8c839e060b4aca52a3c1b9	android-app://com.google.android.googlequicksearchbox/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.68.225.244	2026-03-13 04:53:38.764
232	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 04:59:33.003
233	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 05:40:31.395
234	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 05:52:53.739
235	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 06:04:24.925
236	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 06:04:53.86
237	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 06:08:46.043
238	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 06:14:18.71
239	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 06:17:08.726
240	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 06:26:05.08
241	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 06:26:05.083
242	/	Home	cea2533e1f1f23a6fb078f8991408881	https://www.google.com/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.159.122.52	2026-03-13 06:35:29.972
243	/signature-voyage	Signature Voyage	cea2533e1f1f23a6fb078f8991408881	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.159.122.52	2026-03-13 07:26:45.632
244	/our-inspiration	Our Inspiration	cea2533e1f1f23a6fb078f8991408881	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.159.122.52	2026-03-13 07:26:57.659
245	/prestige-event	Prestige Events	e11dd9b2181c63eb80674fd2b8de19e9	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.68.164.118	2026-03-13 07:27:30.373
246	/prestige-event	Prestige Events	f5d49a4cc4bfdd75dd6f5c3986f40bb9	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-13 07:27:40.333
247	/our-inspiration	Our Inspiration	f5d49a4cc4bfdd75dd6f5c3986f40bb9	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-13 07:28:01.392
248	/prestige-event	Prestige Events	70580e2cf44ddba75a7c97d102688bd3	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.107.92	2026-03-13 07:28:04.184
249	/signature-voyage	Signature Voyage	f5d49a4cc4bfdd75dd6f5c3986f40bb9	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-13 07:28:05.647
250	/prestige-event	Prestige Events	f5d49a4cc4bfdd75dd6f5c3986f40bb9	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-13 07:28:07.175
251	/our-inspiration	Our Inspiration	f5d49a4cc4bfdd75dd6f5c3986f40bb9	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-13 07:28:08.767
252	/	Home	1f5f6468d1e895abfa4872c36989135d	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.69.89.196	2026-03-13 07:39:08.852
253	/	Home	d1ba4fc149ee477eb2da3f03afa10c42	https://werkudara.com/	Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.7339.0 Safari/537.36	172.69.176.66	2026-03-13 07:42:50.077
254	/	Home	fe8a63d32d56fba87bea10763ae48f21	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.123	2026-03-13 08:49:15.46
255	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 08:59:36.653
256	/	Home	31b18f69ccff315c83acdc705f32ef2c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.166.117	2026-03-13 09:19:58.93
257	/	Home	23abb7d1cf69c355c9d102938eefefc4	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 CloudflareObservatory/1.0	172.70.126.51	2026-03-13 09:21:15.834
258	/	Home	8a107145d69951b21c2b7262ce5f1b97	\N	Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36 CloudflareObservatory/1.0	172.70.100.174	2026-03-13 09:21:16.596
259	/	Home	3d96d8ad70407f6a7785fbedc1809c58	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 CloudflareObservatory/1.0	172.70.126.62	2026-03-13 09:21:28.829
260	/	Home	84b3530cdfead7a49a25b83b832ff6f5	\N	Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36 CloudflareObservatory/1.0	108.162.216.161	2026-03-13 09:21:29.925
261	/	Home	d962b033a49c885dd9366480f481f48a	\N	Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse	172.68.87.4	2026-03-13 09:21:39.93
262	/	Home	ba0bfa99263ff48c16fb31d6246e2410	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Chrome-Lighthouse	172.68.87.4	2026-03-13 09:21:39.993
263	/	Home	3d96d8ad70407f6a7785fbedc1809c58	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 CloudflareObservatory/1.0	172.70.126.62	2026-03-13 09:21:40.879
264	/	Home	84b3530cdfead7a49a25b83b832ff6f5	\N	Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36 CloudflareObservatory/1.0	108.162.216.161	2026-03-13 09:21:42.804
265	/	Home	21791504bace87e7d3019dfc5dc897a4	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/138.0.7204.23 Safari/537.36	104.23.209.211	2026-03-13 10:34:52.992
266	/our-inspiration	Our Inspiration	8ac721ccfc4268b78e2c37f4e045f8c8	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.225	2026-03-13 11:11:21.203
267	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:28:18.218
268	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:32:46.55
269	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:32:50.053
270	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:33:08.917
271	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:33:24.432
272	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:38:39.297
273	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:42:26.326
274	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:57:04.562
275	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:59:00.419
276	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 14:00:26.592
277	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 14:07:25.111
278	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 14:07:35.974
279	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 14:10:04.403
280	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 14:13:17.279
281	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 14:15:19.58
282	/our-inspiration	Our Inspiration	533bdee2c407d966a6d5269167173d29	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-13 17:31:27.839
283	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 19:02:32.459
284	/	Home	1c27679d8e0c88239e521ca76441a747	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	::1	2026-03-13 19:19:09.772
285	/	Home	1c27679d8e0c88239e521ca76441a747	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	::1	2026-03-13 19:21:31.2
286	/	Home	1c27679d8e0c88239e521ca76441a747	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	::1	2026-03-13 19:27:37.055
287	/	Home	1c27679d8e0c88239e521ca76441a747	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	::1	2026-03-13 19:35:54.886
288	/	Home	1c27679d8e0c88239e521ca76441a747	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	::1	2026-03-13 19:57:10.802
289	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 20:03:23.527
290	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 20:03:23.534
291	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 20:05:26.372
292	/	Home	ca885af68595368e3a126e0909443807	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/138.0.7204.23 Safari/537.36	172.68.138.130	2026-03-14 10:43:30.516
293	/	Home	ea72ff528a411259391f302e8a728355	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/138.0.7204.23 Safari/537.36	104.23.211.30	2026-03-14 10:55:40.211
294	/	Home	8867103f5e717dc2411495c403f0b985	\N	Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/100.0.4896.127 Safari/537.36	172.68.22.54	2026-03-14 15:33:27.678
295	/our-inspiration	Our Inspiration	1c27126aa052441be3c7ccfe9409c361	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	162.158.88.120	2026-03-15 03:23:04.967
296	/	Home	558c601b04f2c31d782b485de55e5a3a	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.88.120	2026-03-15 19:36:51.198
297	/	Home	558c601b04f2c31d782b485de55e5a3a	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.88.120	2026-03-15 19:37:09.173
298	/	Home	6bfe28737bfedeca6c939862c69f28b8	\N	vercel-screenshot/1.0	64.23.148.34	2026-03-15 19:46:58.509
299	/	Home	cc92b10808f3e87ad636a358d9bf73a5	\N	vercel-screenshot/1.0	164.92.121.12	2026-03-15 19:46:59.074
300	/	Home	dc53b554eaaeef2695d2efb89b6e0c84	https://vercel.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.108.67	2026-03-15 19:50:51.84
301	/prestige-event	Prestige Events	dc53b554eaaeef2695d2efb89b6e0c84	https://vercel.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.108.67	2026-03-15 19:51:13.219
302	/	Home	239f15a1cb4cfb26caeeaafb78a7b3fb	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.70.188.79	2026-03-15 19:51:38.02
303	/	Home	652c3c03d939c945e357c8480118b7dc	\N	vercel-screenshot/1.0	143.198.135.87	2026-03-15 19:52:25.79
304	/	Home	375e1decf914184ca4838dad075a1c32	\N	vercel-screenshot/1.0	24.199.119.30	2026-03-15 19:52:25.875
305	/	Home	dd951ceb5cf0d2e01c30df0775c13215	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.108.98	2026-03-16 01:55:35.688
306	/	Home	69755ecddbf52f6b5164d222bc326d52	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.108.66	2026-03-16 01:56:17.276
307	/	Home	391d0dd4e025bb7d59194eeaddc47a7e	https://www.takshaka.id/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	162.158.108.66	2026-03-16 02:01:13.67
308	/	Home	e3de6868c8366131bb602ebc77c96525	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.81.47	2026-03-16 02:33:44.32
309	/	Home	e3de6868c8366131bb602ebc77c96525	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.81.47	2026-03-16 02:33:55.339
310	/	Home	e3de6868c8366131bb602ebc77c96525	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.81.47	2026-03-16 02:34:20.365
311	/	Home	e3de6868c8366131bb602ebc77c96525	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.81.47	2026-03-16 02:34:40.212
312	/	Home	591d94969b7a7f0150ce30cf3442dadc	android-app://com.google.android.googlequicksearchbox/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-16 02:40:05.927
313	/	Home	8c5872e1391b6d8d4ebcb065e8c47524	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	108.162.227.53	2026-03-16 02:44:42.206
314	/	Home	bfc28c00168a04126fb3f4df7f82db8c	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.159.122.52	2026-03-16 02:46:52.859
315	/	Home	bfc28c00168a04126fb3f4df7f82db8c	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.159.122.52	2026-03-16 02:47:30.41
316	/	Home	bfc28c00168a04126fb3f4df7f82db8c	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.159.122.52	2026-03-16 02:47:44.692
317	/	Home	bfc28c00168a04126fb3f4df7f82db8c	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.159.122.52	2026-03-16 02:47:54.872
318	/	Home	bfc28c00168a04126fb3f4df7f82db8c	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.159.122.52	2026-03-16 02:47:56.748
319	/	Home	bfc28c00168a04126fb3f4df7f82db8c	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.159.122.52	2026-03-16 02:47:58.856
320	/	Home	bfc28c00168a04126fb3f4df7f82db8c	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.159.122.52	2026-03-16 02:48:13.652
321	/	Home	5cf98ce4a43582fb199a7c87dd58c73a	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.158.22.130	2026-03-16 03:04:11.345
322	/	Home	d4a230e1700d6bbcd95e8522d761e27a	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)	162.158.106.131	2026-03-16 03:04:12.596
323	/	Home	5d8ac1193043366625c6ae62e94dbe80	https://www.google.com/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.158.106.131	2026-03-16 03:04:18.761
324	/	Home	08d8de77f158602ccae902e4576fd53c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.166.116	2026-03-16 04:13:03.296
325	/	Home	d2e3ed9425f5967dfce08c9c51829fc7	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.68.164.118	2026-03-16 04:25:17.851
326	/	Home	a68edf0077766e282612f0b6cc3c7915	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.165.42	2026-03-16 04:30:39.874
327	/	Home	a68edf0077766e282612f0b6cc3c7915	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.165.42	2026-03-16 04:30:48.587
328	/our-inspiration	Our Inspiration	a68edf0077766e282612f0b6cc3c7915	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.165.42	2026-03-16 04:31:05.237
329	/	Home	b4e006dd6c5319188001be4a97b6411f	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.71.124.225	2026-03-16 04:50:59.269
330	/	Home	1170b0a72c5067af40a85569f33e3e6f	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.166.117	2026-03-16 04:59:55.196
331	/	Home	1170b0a72c5067af40a85569f33e3e6f	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.166.117	2026-03-16 05:00:00.616
332	/our-inspiration	Our Inspiration	9828a05f823dfa096cf38987cf27bd76	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.22.66.185	2026-03-16 05:33:53.518
333	/	Home	784c93dfac4cd1dcce6976d1846281a1	https://www.takshaka.id/our-inspiration	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.22.66.184	2026-03-16 05:33:59.437
334	/	Home	9828a05f823dfa096cf38987cf27bd76	https://www.takshaka.id/our-inspiration	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.22.66.185	2026-03-16 05:34:21.768
335	/	Home	6eee0dbb41837c9bd808fc24cd21dd18	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.68.164.119	2026-03-16 06:12:07.194
336	/	Home	a8c9ab683e78d2448497b584b8519094	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.116 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	172.71.126.150	2026-03-16 07:13:26.137
337	/	Home	a723f6f8309f39b221bfcac7795563c7	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.116 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	172.68.22.54	2026-03-16 08:03:16.725
338	/	Home	79006ffb7e38c5d19029c918b4293a5f	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.88.98	2026-03-16 08:46:28.63
339	/	Home	ba0bfa99263ff48c16fb31d6246e2410	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Chrome-Lighthouse	172.68.87.4	2026-03-16 08:46:49.349
340	/	Home	d962b033a49c885dd9366480f481f48a	\N	Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse	172.68.87.4	2026-03-16 08:46:50.192
341	/	Home	fec7b818c8a7ecc90ab12dd8cdf74bdb	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.69.166.116	2026-03-16 09:04:03.352
342	/	Home	e804d343044fbb6934c64f2a0055006c	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.69.166.116	2026-03-16 09:04:31.662
343	/	Home	018d10573895f8ef05cb15c18c6fb518	\N	vercel-screenshot/1.0	147.182.228.81	2026-03-16 09:08:43.047
344	/	Home	c8782180a5168f48d1ecdbbb5c58991b	\N	vercel-screenshot/1.0	143.110.235.112	2026-03-16 09:08:43.705
345	/	Home	8964cc737ae4e58c395f64e412636201	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.71.124.210	2026-03-16 09:10:27.323
346	/	Home	81d7de3a61c80686bff8f5803ecd9f18	\N	vercel-screenshot/1.0	146.190.52.253	2026-03-16 09:13:46.624
347	/	Home	bb6e2bf5e28c521102352d47bb479f83	\N	vercel-screenshot/1.0	137.184.5.60	2026-03-16 09:13:47.236
348	/	Home	b92810f045f2352b78640bfed9612c27	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.176.67	2026-03-16 09:17:36.335
349	/	Home	4f151c7e19866c064359155cf9334557	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.116 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	172.68.22.55	2026-03-16 16:17:46.296
350	/	Home	4e2614d2b179132ed047c59516e26feb	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.163.239	2026-03-17 01:18:24.066
351	/prestige-event	Prestige Events	4e2614d2b179132ed047c59516e26feb	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.163.239	2026-03-17 01:19:05.176
352	/	Home	4e2614d2b179132ed047c59516e26feb	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.163.239	2026-03-17 01:19:51.649
353	/	Home	4e2614d2b179132ed047c59516e26feb	https://www.takshaka.id/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.163.239	2026-03-17 01:19:54.545
354	/	Home	102814e54b080cae2520913b2735e9b9	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.70.208.34	2026-03-17 01:39:59.144
355	/	Home	11e7ef5f892c589e292e14711459df09	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.71.81.68	2026-03-17 01:44:05.879
356	/	Home	11e7ef5f892c589e292e14711459df09	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.71.81.68	2026-03-17 01:44:11.401
357	/	Home	11e7ef5f892c589e292e14711459df09	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.71.81.68	2026-03-17 01:44:33.862
358	/	Home	f2401f5d38e8131990bbf0dc3dbbfb2d	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	104.23.175.60	2026-03-17 01:45:35.988
359	/	Home	f2401f5d38e8131990bbf0dc3dbbfb2d	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	104.23.175.60	2026-03-17 01:45:47.075
360	/	Home	513e2d155b085d31672ff975fb630dce	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.69.176.131	2026-03-17 01:55:43.863
361	/	Home	201b82ec6c852d63810b7dc042d2bcf9	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.214.155	2026-03-17 01:59:52.158
362	/	Home	c89ca78cdf97b181fc4e4b94e4012cd7	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.219.90	2026-03-17 02:01:19.921
363	/	Home	1f5f6468d1e895abfa4872c36989135d	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.69.89.196	2026-03-17 02:03:06.701
364	/	Home	e17ed8e311849bfe406591ff6c44db5b	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.70.143.231	2026-03-17 04:03:37.27
365	/	Home	c58295fc978ad3f4fe4670e921e148dc	https://www.google.com/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.68.105.141	2026-03-17 06:04:30.308
366	/	Home	8fbac8a272ac3a9656cbe88ba34eb452	https://werkudara.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.69.166.116	2026-03-17 06:20:31.266
367	/	Home	6ff8e303008202468b52471b62164891	https://werkudara.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.22.66.54	2026-03-17 06:29:04.485
368	/	Home	d3a7c2760e0f983d3b0b18920ce25157	https://www.google.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	172.68.229.53	2026-03-17 07:07:52.014
369	/	Home	58bcd82ef16f2c374057df15ecf08575	https://www.google.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.70.162.103	2026-03-17 07:07:59.239
370	/	Home	82b74f9e2b18a734f29e273b1507a304	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	172.71.190.158	2026-03-17 07:32:23.845
371	/	Home	5664e6088e87f5480b5f1d7f389d76ab	https://www.google.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	172.64.192.124	2026-03-17 07:41:46.479
372	/prestige-event	Prestige Events	483218fa81f7ab7b79055106dabfdd71	https://www.google.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	172.64.192.125	2026-03-17 07:41:53.413
373	/	Home	9e96f4ccfbc7f98ff7cb302e040a848a	https://www.google.com/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	172.68.105.141	2026-03-17 09:55:51.361
374	/	Home	283942df3005c104ed3ee4bf3bb37702	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.88.68	2026-03-18 00:55:56.099
375	/	Home	787afbb68f67b54721a411ceecb950ec	https://www.google.com/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	172.68.105.140	2026-03-18 02:11:29
376	/	Home	46e28db03ea19279d16439ec927a5260	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/146.0.0.0 Safari/537.36	162.158.79.231	2026-03-18 06:02:19.539
377	/	Home	440af5032a9035f149e14b1484cfca29	https://l.wl.co/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.23.175.87	2026-03-18 06:38:41.17
378	/	Home	3b20d4ee2dcfc6a3c26e3e74050cdfd2	https://l.wl.co/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.22.133	2026-03-18 06:42:00.72
379	/	Home	fab6a6773b628dc2a98beb3689818c83	https://l.wl.co/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.107.91	2026-03-18 06:43:18.498
380	/	Home	f5d49a4cc4bfdd75dd6f5c3986f40bb9	https://l.wl.co/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-18 06:43:28.06
381	/our-inspiration	Our Inspiration	f5d49a4cc4bfdd75dd6f5c3986f40bb9	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-18 06:43:32.775
382	/signature-voyage	Signature Voyage	f5d49a4cc4bfdd75dd6f5c3986f40bb9	https://www.takshaka.id/our-inspiration	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-18 06:44:08.635
383	/	Home	d5cba89d2194941880cc2e0aa7f1a615	https://www.google.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	172.69.165.43	2026-03-18 09:52:43.603
384	/	Home	8d0e1af54c4816a7864505a2d2716e30	https://www.facebook.com/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	172.71.144.155	2026-03-18 15:06:33.729
385	/	Home	ee496f67ce18480e9fa8cc614a7d9a22	https://www.facebook.com/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	172.69.65.62	2026-03-18 15:07:35.045
386	/	Home	655a401023e564d11dbe7f8487eb2c02	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.68.211.5	2026-03-19 18:16:56.779
387	/	Home	e47457de48b7f8d93747aa5b2d273455	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.159 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	198.41.227.13	2026-03-20 05:48:01.709
388	/	Home	87bed94ece8dae84b74118b06f935c5e	https://www.facebook.com/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	172.68.23.174	2026-03-20 09:23:55.464
389	/	Home	7ca60f51af2a24ed411cbbffe87bc807	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	162.158.155.80	2026-03-20 10:28:59.398
390	/	Home	2ec56d9630f79d6a9974247559c5cb73	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/142.0.0.0 Safari/537.36	104.23.160.122	2026-03-22 03:10:11.051
391	/	Home	cb4c842c1c5432b1cee50ca61086c53d	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.69.165.43	2026-03-22 09:34:32.292
392	/	Home	34fc38c66a0bc68d884adb53c00c4b5c	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.68.164.118	2026-03-22 09:37:38.942
393	/	Home	34fc38c66a0bc68d884adb53c00c4b5c	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.68.164.118	2026-03-22 09:37:43.265
394	/	Home	34fc38c66a0bc68d884adb53c00c4b5c	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.68.164.118	2026-03-22 09:37:48.78
395	/prestige-event	Prestige Events	34fc38c66a0bc68d884adb53c00c4b5c	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.68.164.118	2026-03-22 09:37:57.099
396	/	Home	794cbb3fece5870d2b3591de16db9556	\N	Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/100.0.4896.127 Safari/537.36	172.71.147.135	2026-03-22 16:27:50.294
397	/	Home	96a777593aeafaae73f8dda8b629b400	https://www.google.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.70.108.175	2026-03-23 07:51:45.384
398	/	Home	f757986c6f13b92874ef90668639abe0	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.71.124.211	2026-03-23 09:39:36.07
399	/	Home	15393c620492722fe23856879652b3f3	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.162.143	2026-03-24 04:02:55.848
400	/	Home	752c462d81895ba791196579670e8ebe	https://www.facebook.com/	Dalvik/2.1.0 (Linux; U; Android 14; Quest 2 Build/UP1A.231005.007.A1)	172.69.65.150	2026-03-25 02:04:11.137
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pages (id, title, slug, content, status, meta_title, meta_description, created_by, created_at, updated_at, deleted_at, scheduled_at, published_at) FROM stdin;
1	About us	about-us	{"blocks":[{"id":"block-1773122917896","columns":1,"content":[{"id":"col-1773122917896-0","type":"text","content":"<p><em><span style=\\"font-size: 20px;\\">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</span></em></p>"}]}]}	published			1	2026-03-10 06:08:48.447	2026-03-10 06:08:48.447	\N	\N	\N
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.settings (id, key, value, type, description, created_at, updated_at) FROM stdin;
1	site_name	Takshaka Indonesia	string	\N	2026-03-06 07:34:12.086	2026-03-06 07:43:22.491
2	site_description	Our Curated Travel Experience with Meaningful Impact	string	\N	2026-03-06 07:34:12.504	2026-03-06 07:43:22.69
3	site_url	http://localhost:3000/	string	\N	2026-03-06 07:34:12.726	2026-03-06 07:43:22.877
4	admin_email		string	\N	2026-03-06 07:34:12.912	2026-03-06 07:43:23.112
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, created_at, deleted_at) FROM stdin;
1	Admin User	admin@example.com	24298b3fd1a769edbf2f1e7019b531cf:2b63269cfe58645e5bc6c4cb37bca5a880124e0c58c865b98ba41d7f6c0d01e2b7b549520d2bd14ecf37a26253d8cfd46c5a56df44c78e2b8f39f153fef230ee	editor	2026-03-04 19:00:22.164	\N
\.


--
-- Data for Name: visitors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.visitors (id, visitor_id, referer_domain, country, city, user_agent, ip_address, first_visit, last_visit, page_views_count) FROM stdin;
27	5febf67f00cc117b1b2b135827041e4f	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.159.102.149	2026-03-12 07:30:54.799	2026-03-12 07:30:54.799	1
28	dd0ceab340d06d90772cbf98ee67f36f	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.88.120	2026-03-12 07:35:24.928	2026-03-12 07:35:24.928	1
74	d1ba4fc149ee477eb2da3f03afa10c42	werkudara.com	\N	\N	Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.7339.0 Safari/537.36	172.69.176.66	2026-03-13 07:42:51.228	2026-03-13 07:42:51.228	1
73	1f5f6468d1e895abfa4872c36989135d	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.69.89.196	2026-03-13 07:39:10.033	2026-03-17 02:03:07.86	2
4	b9f3348b2b4e6c98e046228f2d9b68e0	takshaka-project-fj6we71k9-takshakabaliwebsite-6496s-projects.vercel.app	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	103.171.146.56	2026-03-11 14:02:29.684	2026-03-11 14:02:29.684	1
5	2af78c7389a361b6f8bfaded74b2831f	\N	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1	104.22.17.121	2026-03-11 14:24:42.773	2026-03-11 14:24:42.773	1
6	143f5035b2316b60391619283265e65e	\N	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1	162.159.104.152	2026-03-11 14:24:42.773	2026-03-11 14:24:42.773	1
7	a49536e036865c053464536e88eb811f	www.google.com	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	172.69.194.242	2026-03-11 16:21:35.071	2026-03-11 16:21:35.071	1
8	e7a848eff7d785f79db73ab2e77980a7	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36	162.158.38.194	2026-03-11 17:24:02.209	2026-03-11 17:24:02.209	1
9	2a9178240aa698ac67dd2c5ea4988c9b	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.7680.71 Safari/537.36	104.23.160.42	2026-03-11 17:58:05.535	2026-03-11 17:58:05.535	1
10	5223c35fd6c9cec41bfb8390854fffde	\N	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1	108.162.245.232	2026-03-11 17:58:12.625	2026-03-11 17:58:12.625	1
12	590bbe3676d9b99808de5f97f3d3e060	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.63	2026-03-11 19:07:11.869	2026-03-11 19:07:17.341	2
11	0a1f58a867b8dbed75db578652a0e79c	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.62	2026-03-11 19:07:05.668	2026-03-11 19:07:29.158	3
20	20b7f9b37830dcfa49f33a0cf86265f7	\N	\N	\N	vercel-screenshot/1.0	137.184.12.43	2026-03-12 04:52:05.31	2026-03-12 23:25:51.877	2
3	656c15f17bd7ce7e83a35253c2cb71d0	\N	\N	\N	vercel-screenshot/1.0	137.184.37.40	2026-03-11 14:02:03.974	2026-03-13 02:52:32.896	4
13	703c916427175df8d52db5f6452665ee	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.190.18	2026-03-11 19:16:21.571	2026-03-11 19:16:25.668	5
15	77fb187d3f15bad35c90a7f0f21b726f	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.146	2026-03-12 01:29:30.724	2026-03-12 01:29:58.125	3
16	1e89ccafd6de8ca01442e70f7f1e853b	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15	104.23.175.132	2026-03-12 02:06:41.045	2026-03-12 02:06:41.045	1
17	8d76ff55ce7b21ace96d1b2beacaac54	www.google.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15	104.23.175.146	2026-03-12 02:07:03.646	2026-03-12 02:07:03.646	1
29	82fcd9b928326cea6501d2bc6e45ec12	\N	\N	\N	Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36	162.158.95.141	2026-03-12 08:02:14.762	2026-03-12 08:02:14.762	1
18	158403fc36a9c85f172f7c0f84bc2df9	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.67	2026-03-12 02:26:35.105	2026-03-12 02:27:19.833	5
30	5c7d7ba30d6b0fae25348a5e6613d8df	\N	\N	\N	vercel-screenshot/1.0	143.198.63.243	2026-03-12 08:44:38.193	2026-03-12 08:44:38.193	1
31	5e261d12c2cca4e1cf0a2c335dee6132	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.22.66.54	2026-03-12 08:57:37.541	2026-03-12 08:57:37.541	1
32	258896a5e944ab66e57bd999418b0c71	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.22.66.184	2026-03-12 08:57:55.248	2026-03-12 08:57:55.248	1
34	f26b7c7028ada054a4d0308a50e3bd1b	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.22.66.184	2026-03-12 09:15:40.866	2026-03-12 09:15:41.634	2
35	eeeff2ff4d225f276d599b69de081eaa	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.70.188.68	2026-03-12 09:16:33.737	2026-03-12 09:16:33.737	1
2	2ecea537a54c33ea169f774420db3e64	\N	\N	\N	vercel-screenshot/1.0	146.190.133.82	2026-03-11 14:02:03.053	2026-03-12 09:23:47.551	2
19	8ed7c16d68e5569b61519389ad1b5811	\N	\N	\N	vercel-screenshot/1.0	64.23.178.209	2026-03-12 04:52:05.323	2026-03-12 04:52:05.323	1
21	77703603fe774f95cf5a6f3aa4d563d0	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.97	2026-03-12 04:52:55.488	2026-03-12 04:52:55.488	1
22	606106c53fc4469b816b1048c5d6ada3	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.66	2026-03-12 04:53:03.712	2026-03-12 04:53:05.031	2
23	120f8ee4fbd01059045c153ac975b829	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.132 Safari/537.36	172.68.27.95	2026-03-12 05:30:20.997	2026-03-12 05:30:20.997	1
24	3916615f0d86ee8a7c4547a2b4acc878	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.68.164.119	2026-03-12 06:06:15.158	2026-03-12 06:06:15.158	1
25	e7a1e81b715a820ccf9c61635f71a239	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.71.81.47	2026-03-12 06:13:53.262	2026-03-12 06:13:54.599	2
26	5cecfcbda5f2e1ba94edf1c5dcbfbff9	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.224	2026-03-12 07:10:21.597	2026-03-12 07:11:26.306	7
48	4339b8c1f32ff9d0bfa80529007d8a62	\N	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7.3 Mobile/15E148 Safari/604.1	172.69.166.117	2026-03-12 10:05:08.477	2026-03-12 10:05:09.858	2
36	d21202af1b1aa8f74c5d8f907832acbb	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.71.124.225	2026-03-12 09:19:21.895	2026-03-12 09:19:21.895	1
37	dc8297ced045cba803aecc186ae2273e	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.88.120	2026-03-12 09:19:27.748	2026-03-12 09:19:27.748	1
38	a2d288b2eddaa7773355618da8ec1327	\N	\N	\N	vercel-screenshot/1.0	143.110.147.18	2026-03-12 09:23:48.24	2026-03-12 09:23:48.24	1
49	fcb7b9007c2d91649ed142f3a76816e6	\N	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7.3 Mobile/15E148 Safari/604.1	172.71.214.95	2026-03-12 12:46:12.23	2026-03-12 12:46:12.23	1
39	9f12d59870d8e4f628ba09adee695550	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.70.189.97	2026-03-12 09:24:50.968	2026-03-12 09:24:55.396	2
33	65af2fd5fa856771509ddf0798f74de7	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.23.175.147	2026-03-12 08:59:33.193	2026-03-12 09:41:05.518	3
40	e3865ed28c9598b42e26b189dda43ec0	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.68.164.119	2026-03-12 09:42:40.411	2026-03-12 09:42:40.411	1
41	29d5a21600fb713055fd320b1119edc1	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	172.70.248.41	2026-03-12 09:46:21.697	2026-03-12 09:46:21.697	1
42	2090bd6d1b1e943eab5fa1ca1e3b4e76	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	172.71.148.122	2026-03-12 09:46:29.873	2026-03-12 09:46:29.873	1
75	fe8a63d32d56fba87bea10763ae48f21	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.123	2026-03-13 08:49:16.831	2026-03-13 08:49:16.831	1
50	182469a7505c0260f1e1f09caf40755b	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.132	2026-03-12 14:07:13.385	2026-03-12 14:07:13.803	2
90	6bfe28737bfedeca6c939862c69f28b8	\N	\N	\N	vercel-screenshot/1.0	64.23.148.34	2026-03-15 19:46:59.667	2026-03-15 19:46:59.667	1
52	015b75bd46b704e798c19d67e202ef1a	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.207	2026-03-12 14:10:11.601	2026-03-12 14:10:11.601	1
43	9066042fc90b0b1658cf09f1ae0004e2	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:55:06.459	2026-03-12 09:56:37.636	10
44	0dc3d0464a39e72fe843ec9b1a9aa843	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.69.165.42	2026-03-12 09:57:15.938	2026-03-12 09:57:15.938	1
45	b498251159d50f20c65b209251f0f2dc	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.71.124.225	2026-03-12 09:57:28.719	2026-03-12 09:57:28.719	1
51	8031e83149b030dc445a606263627699	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.146	2026-03-12 14:07:15.081	2026-03-12 14:11:12.557	7
53	b0f782072b6f243232f3098b75c3a3fb	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.147	2026-03-12 14:11:09.19	2026-03-12 14:11:19.019	2
46	b0e709518d972e70890db9ad626b2fda	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.165.42	2026-03-12 09:57:48.402	2026-03-12 10:00:18.683	5
54	2d8fc9b5725e30f7a3ca1ac3712c86bd	\N	\N	\N	vercel-screenshot/1.0	165.232.154.185	2026-03-12 23:25:51.389	2026-03-12 23:25:51.389	1
55	f59427535db2a7f3b51594ad148dc89e	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	104.23.175.146	2026-03-13 00:48:51.102	2026-03-13 00:48:51.102	1
56	c276fba0efc452afea59187df83d1b7f	www.takshaka.id	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.81.48	2026-03-13 00:49:37.474	2026-03-13 00:49:37.474	1
57	b328e658ca5fe4c2f817c9b0efd25352	www.takshaka.id	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.70.93.16	2026-03-13 00:50:12.741	2026-03-13 00:50:37.195	2
58	17c181dd0b48a2659e78be14a7bd8429	www.takshaka.id	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.70.93.16	2026-03-13 00:50:44.063	2026-03-13 00:50:44.063	1
59	083d490a4d2636ec046fb8c27bbf26ca	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.189.89	2026-03-13 02:01:26.8	2026-03-13 02:01:26.8	1
60	65348e3778ac5392c0cf5d9e3838c336	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.190.18	2026-03-13 02:36:19.804	2026-03-13 02:36:38.024	4
61	19ed397c5af18eb744d6e2d3839266ff	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	108.162.227.37	2026-03-13 02:38:34.95	2026-03-13 02:38:34.95	1
63	bac9d978a12c3988443c54e3cb57472b	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.71.124.224	2026-03-13 02:43:39.681	2026-03-13 02:43:39.681	1
62	6eca5866d975f8dd8512dfa04b805286	\N	\N	\N	vercel-screenshot/1.0	137.184.85.43	2026-03-13 02:40:05.06	2026-03-13 02:52:32.869	2
64	3819f4eaeae1fac71f2a9e54285aedf0	vercel.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.71.82.15	2026-03-13 02:53:38.057	2026-03-13 02:53:38.057	1
65	565b2d351206e4bd41afc6598e271d18	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	104.22.66.185	2026-03-13 03:46:33.779	2026-03-13 03:46:33.779	1
66	e607c3d5ff36bbc7d295f2f94f034ceb	www.google.com	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.69.166.116	2026-03-13 04:04:57.81	2026-03-13 04:04:57.81	1
67	cbaf668c4449055da9781ae2eb87e6b5	www.google.com	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.70.108.174	2026-03-13 04:27:12.587	2026-03-13 04:27:12.587	1
47	31b18f69ccff315c83acdc705f32ef2c	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.166.117	2026-03-12 10:01:17.34	2026-03-13 09:20:00.099	7
68	1a40847b4e8c839e060b4aca52a3c1b9	com.google.android.googlequicksearchbox	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.68.225.244	2026-03-13 04:53:40.007	2026-03-13 04:53:40.007	1
76	23abb7d1cf69c355c9d102938eefefc4	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 CloudflareObservatory/1.0	172.70.126.51	2026-03-13 09:21:17.068	2026-03-13 09:21:17.068	1
77	8a107145d69951b21c2b7262ce5f1b97	\N	\N	\N	Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36 CloudflareObservatory/1.0	172.70.100.174	2026-03-13 09:21:17.736	2026-03-13 09:21:17.736	1
78	3d96d8ad70407f6a7785fbedc1809c58	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 CloudflareObservatory/1.0	172.70.126.62	2026-03-13 09:21:29.204	2026-03-13 09:21:41.253	2
79	84b3530cdfead7a49a25b83b832ff6f5	\N	\N	\N	Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36 CloudflareObservatory/1.0	108.162.216.161	2026-03-13 09:21:30.3	2026-03-13 09:21:43.178	2
82	21791504bace87e7d3019dfc5dc897a4	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/138.0.7204.23 Safari/537.36	104.23.209.211	2026-03-13 10:34:54.151	2026-03-13 10:34:54.151	1
83	8ac721ccfc4268b78e2c37f4e045f8c8	www.takshaka.id	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.225	2026-03-13 11:11:22.364	2026-03-13 11:11:22.364	1
69	cea2533e1f1f23a6fb078f8991408881	www.google.com	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.159.122.52	2026-03-13 06:35:31.144	2026-03-13 07:26:58.042	3
70	e11dd9b2181c63eb80674fd2b8de19e9	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.68.164.118	2026-03-13 07:27:31.51	2026-03-13 07:27:31.51	1
72	70580e2cf44ddba75a7c97d102688bd3	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.107.92	2026-03-13 07:28:04.561	2026-03-13 07:28:04.561	1
14	533bdee2c407d966a6d5269167173d29	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-12 01:29:03.031	2026-03-13 17:31:29.031	8
84	1c27679d8e0c88239e521ca76441a747	\N	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	::1	2026-03-13 19:19:10.502	2026-03-13 19:57:12.137	5
1	3f0dc78b8eefd550ca7ff88caf8b7873	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-10 22:18:21.018	2026-03-13 20:05:27.076	114
85	ca885af68595368e3a126e0909443807	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/138.0.7204.23 Safari/537.36	172.68.138.130	2026-03-14 10:43:31.683	2026-03-14 10:43:31.683	1
86	ea72ff528a411259391f302e8a728355	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/138.0.7204.23 Safari/537.36	104.23.211.30	2026-03-14 10:55:41.365	2026-03-14 10:55:41.365	1
87	8867103f5e717dc2411495c403f0b985	\N	\N	\N	Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/100.0.4896.127 Safari/537.36	172.68.22.54	2026-03-14 15:33:28.911	2026-03-14 15:33:28.911	1
88	1c27126aa052441be3c7ccfe9409c361	www.takshaka.id	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	162.158.88.120	2026-03-15 03:23:06.142	2026-03-15 03:23:06.142	1
89	558c601b04f2c31d782b485de55e5a3a	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.88.120	2026-03-15 19:36:52.37	2026-03-15 19:37:09.549	2
91	cc92b10808f3e87ad636a358d9bf73a5	\N	\N	\N	vercel-screenshot/1.0	164.92.121.12	2026-03-15 19:47:00.227	2026-03-15 19:47:00.227	1
92	dc53b554eaaeef2695d2efb89b6e0c84	vercel.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.108.67	2026-03-15 19:50:52.99	2026-03-15 19:51:13.599	2
93	239f15a1cb4cfb26caeeaafb78a7b3fb	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.70.188.79	2026-03-15 19:51:38.397	2026-03-15 19:51:38.397	1
94	652c3c03d939c945e357c8480118b7dc	\N	\N	\N	vercel-screenshot/1.0	143.198.135.87	2026-03-15 19:52:26.935	2026-03-15 19:52:26.935	1
95	375e1decf914184ca4838dad075a1c32	\N	\N	\N	vercel-screenshot/1.0	24.199.119.30	2026-03-15 19:52:26.999	2026-03-15 19:52:26.999	1
96	dd951ceb5cf0d2e01c30df0775c13215	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.108.98	2026-03-16 01:55:36.868	2026-03-16 01:55:36.868	1
97	69755ecddbf52f6b5164d222bc326d52	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.108.66	2026-03-16 01:56:18.415	2026-03-16 01:56:18.415	1
98	391d0dd4e025bb7d59194eeaddc47a7e	www.takshaka.id	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	162.158.108.66	2026-03-16 02:01:14.837	2026-03-16 02:01:14.837	1
99	e3de6868c8366131bb602ebc77c96525	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.81.47	2026-03-16 02:33:45.486	2026-03-16 02:34:40.588	4
100	591d94969b7a7f0150ce30cf3442dadc	com.google.android.googlequicksearchbox	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-16 02:40:07.067	2026-03-16 02:40:07.067	1
81	ba0bfa99263ff48c16fb31d6246e2410	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Chrome-Lighthouse	172.68.87.4	2026-03-13 09:21:41.116	2026-03-16 08:46:49.726	2
80	d962b033a49c885dd9366480f481f48a	\N	\N	\N	Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse	172.68.87.4	2026-03-13 09:21:40.304	2026-03-16 08:46:51.338	2
71	f5d49a4cc4bfdd75dd6f5c3986f40bb9	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-13 07:27:40.709	2026-03-18 06:44:09.875	8
101	8c5872e1391b6d8d4ebcb065e8c47524	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	108.162.227.53	2026-03-16 02:44:43.336	2026-03-16 02:44:43.336	1
102	bfc28c00168a04126fb3f4df7f82db8c	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.159.122.52	2026-03-16 02:46:53.994	2026-03-16 02:48:14.026	7
103	5cf98ce4a43582fb199a7c87dd58c73a	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.158.22.130	2026-03-16 03:04:12.523	2026-03-16 03:04:12.523	1
104	d4a230e1700d6bbcd95e8522d761e27a	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)	162.158.106.131	2026-03-16 03:04:13.726	2026-03-16 03:04:13.726	1
105	5d8ac1193043366625c6ae62e94dbe80	www.google.com	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.158.106.131	2026-03-16 03:04:19.136	2026-03-16 03:04:19.136	1
106	08d8de77f158602ccae902e4576fd53c	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.166.116	2026-03-16 04:13:04.478	2026-03-16 04:13:04.478	1
107	d2e3ed9425f5967dfce08c9c51829fc7	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.68.164.118	2026-03-16 04:25:19.008	2026-03-16 04:25:19.008	1
108	a68edf0077766e282612f0b6cc3c7915	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.165.42	2026-03-16 04:30:41.029	2026-03-16 04:31:05.614	3
109	b4e006dd6c5319188001be4a97b6411f	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.71.124.225	2026-03-16 04:51:00.439	2026-03-16 04:51:00.439	1
110	1170b0a72c5067af40a85569f33e3e6f	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.166.117	2026-03-16 04:59:56.362	2026-03-16 05:00:00.992	2
112	784c93dfac4cd1dcce6976d1846281a1	www.takshaka.id	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.22.66.184	2026-03-16 05:33:59.812	2026-03-16 05:33:59.812	1
111	9828a05f823dfa096cf38987cf27bd76	www.takshaka.id	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.22.66.185	2026-03-16 05:33:54.733	2026-03-16 05:34:22.142	2
113	6eee0dbb41837c9bd808fc24cd21dd18	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.68.164.119	2026-03-16 06:12:08.369	2026-03-16 06:12:08.369	1
114	a8c9ab683e78d2448497b584b8519094	\N	\N	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.116 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	172.71.126.150	2026-03-16 07:13:27.314	2026-03-16 07:13:27.314	1
115	a723f6f8309f39b221bfcac7795563c7	\N	\N	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.116 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	172.68.22.54	2026-03-16 08:03:17.883	2026-03-16 08:03:17.883	1
116	79006ffb7e38c5d19029c918b4293a5f	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.88.98	2026-03-16 08:46:29.811	2026-03-16 08:46:29.811	1
117	fec7b818c8a7ecc90ab12dd8cdf74bdb	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.69.166.116	2026-03-16 09:04:04.507	2026-03-16 09:04:04.507	1
118	e804d343044fbb6934c64f2a0055006c	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.69.166.116	2026-03-16 09:04:32.038	2026-03-16 09:04:32.038	1
119	018d10573895f8ef05cb15c18c6fb518	\N	\N	\N	vercel-screenshot/1.0	147.182.228.81	2026-03-16 09:08:44.2	2026-03-16 09:08:44.2	1
120	c8782180a5168f48d1ecdbbb5c58991b	\N	\N	\N	vercel-screenshot/1.0	143.110.235.112	2026-03-16 09:08:44.978	2026-03-16 09:08:44.978	1
121	8964cc737ae4e58c395f64e412636201	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.71.124.210	2026-03-16 09:10:28.489	2026-03-16 09:10:28.489	1
122	81d7de3a61c80686bff8f5803ecd9f18	\N	\N	\N	vercel-screenshot/1.0	146.190.52.253	2026-03-16 09:13:47.883	2026-03-16 09:13:47.883	1
123	bb6e2bf5e28c521102352d47bb479f83	\N	\N	\N	vercel-screenshot/1.0	137.184.5.60	2026-03-16 09:13:48.389	2026-03-16 09:13:48.389	1
124	b92810f045f2352b78640bfed9612c27	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.176.67	2026-03-16 09:17:37.575	2026-03-16 09:17:37.575	1
152	655a401023e564d11dbe7f8487eb2c02	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.68.211.5	2026-03-19 18:16:57.943	2026-03-19 18:16:57.943	1
125	4f151c7e19866c064359155cf9334557	\N	\N	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.116 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	172.68.22.55	2026-03-16 16:17:47.458	2026-03-16 16:17:47.458	1
126	4e2614d2b179132ed047c59516e26feb	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.163.239	2026-03-17 01:18:25.231	2026-03-17 01:19:54.946	4
127	102814e54b080cae2520913b2735e9b9	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.70.208.34	2026-03-17 01:40:00.303	2026-03-17 01:40:00.303	1
128	11e7ef5f892c589e292e14711459df09	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.71.81.68	2026-03-17 01:44:07.056	2026-03-17 01:44:34.238	3
129	f2401f5d38e8131990bbf0dc3dbbfb2d	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	104.23.175.60	2026-03-17 01:45:37.117	2026-03-17 01:45:47.449	2
130	513e2d155b085d31672ff975fb630dce	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.69.176.131	2026-03-17 01:55:45.027	2026-03-17 01:55:45.027	1
131	201b82ec6c852d63810b7dc042d2bcf9	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.214.155	2026-03-17 01:59:53.306	2026-03-17 01:59:53.306	1
132	c89ca78cdf97b181fc4e4b94e4012cd7	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.219.90	2026-03-17 02:01:21.081	2026-03-17 02:01:21.081	1
133	e17ed8e311849bfe406591ff6c44db5b	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.70.143.231	2026-03-17 04:03:38.542	2026-03-17 04:03:38.542	1
134	c58295fc978ad3f4fe4670e921e148dc	www.google.com	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.68.105.141	2026-03-17 06:04:31.61	2026-03-17 06:04:31.61	1
135	8fbac8a272ac3a9656cbe88ba34eb452	werkudara.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.69.166.116	2026-03-17 06:20:32.437	2026-03-17 06:20:32.437	1
136	6ff8e303008202468b52471b62164891	werkudara.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.22.66.54	2026-03-17 06:29:05.645	2026-03-17 06:29:05.645	1
137	d3a7c2760e0f983d3b0b18920ce25157	www.google.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	172.68.229.53	2026-03-17 07:07:53.269	2026-03-17 07:07:53.269	1
138	58bcd82ef16f2c374057df15ecf08575	www.google.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.70.162.103	2026-03-17 07:07:59.644	2026-03-17 07:07:59.644	1
139	82b74f9e2b18a734f29e273b1507a304	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	172.71.190.158	2026-03-17 07:32:25.019	2026-03-17 07:32:25.019	1
140	5664e6088e87f5480b5f1d7f389d76ab	www.google.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	172.64.192.124	2026-03-17 07:41:47.662	2026-03-17 07:41:47.662	1
141	483218fa81f7ab7b79055106dabfdd71	www.google.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	172.64.192.125	2026-03-17 07:41:53.792	2026-03-17 07:41:53.792	1
142	9e96f4ccfbc7f98ff7cb302e040a848a	www.google.com	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	172.68.105.141	2026-03-17 09:55:52.606	2026-03-17 09:55:52.606	1
143	283942df3005c104ed3ee4bf3bb37702	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.88.68	2026-03-18 00:55:57.268	2026-03-18 00:55:57.268	1
144	787afbb68f67b54721a411ceecb950ec	www.google.com	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	172.68.105.140	2026-03-18 02:11:30.239	2026-03-18 02:11:30.239	1
145	46e28db03ea19279d16439ec927a5260	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/146.0.0.0 Safari/537.36	162.158.79.231	2026-03-18 06:02:20.728	2026-03-18 06:02:20.728	1
146	440af5032a9035f149e14b1484cfca29	l.wl.co	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.23.175.87	2026-03-18 06:38:42.516	2026-03-18 06:38:42.516	1
147	3b20d4ee2dcfc6a3c26e3e74050cdfd2	l.wl.co	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.22.133	2026-03-18 06:42:01.953	2026-03-18 06:42:01.953	1
148	fab6a6773b628dc2a98beb3689818c83	l.wl.co	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.107.91	2026-03-18 06:43:19.804	2026-03-18 06:43:19.804	1
149	d5cba89d2194941880cc2e0aa7f1a615	www.google.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	172.69.165.43	2026-03-18 09:52:44.891	2026-03-18 09:52:44.891	1
150	8d0e1af54c4816a7864505a2d2716e30	www.facebook.com	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	172.71.144.155	2026-03-18 15:06:34.896	2026-03-18 15:06:34.896	1
151	ee496f67ce18480e9fa8cc614a7d9a22	www.facebook.com	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	172.69.65.62	2026-03-18 15:07:36.215	2026-03-18 15:07:36.215	1
153	e47457de48b7f8d93747aa5b2d273455	\N	\N	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.159 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	198.41.227.13	2026-03-20 05:48:02.988	2026-03-20 05:48:02.988	1
154	87bed94ece8dae84b74118b06f935c5e	www.facebook.com	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	172.68.23.174	2026-03-20 09:23:56.768	2026-03-20 09:23:56.768	1
155	7ca60f51af2a24ed411cbbffe87bc807	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	162.158.155.80	2026-03-20 10:29:00.75	2026-03-20 10:29:00.75	1
156	2ec56d9630f79d6a9974247559c5cb73	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/142.0.0.0 Safari/537.36	104.23.160.122	2026-03-22 03:10:12.215	2026-03-22 03:10:12.215	1
157	cb4c842c1c5432b1cee50ca61086c53d	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.69.165.43	2026-03-22 09:34:33.541	2026-03-22 09:34:33.541	1
158	34fc38c66a0bc68d884adb53c00c4b5c	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.68.164.118	2026-03-22 09:37:40.19	2026-03-22 09:37:57.507	4
159	794cbb3fece5870d2b3591de16db9556	\N	\N	\N	Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/100.0.4896.127 Safari/537.36	172.71.147.135	2026-03-22 16:27:51.475	2026-03-22 16:27:51.475	1
160	96a777593aeafaae73f8dda8b629b400	www.google.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.70.108.175	2026-03-23 07:51:46.55	2026-03-23 07:51:46.55	1
161	f757986c6f13b92874ef90668639abe0	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.71.124.211	2026-03-23 09:39:37.369	2026-03-23 09:39:37.369	1
162	15393c620492722fe23856879652b3f3	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.162.143	2026-03-24 04:02:57.054	2026-03-24 04:02:57.054	1
163	752c462d81895ba791196579670e8ebe	www.facebook.com	\N	\N	Dalvik/2.1.0 (Linux; U; Android 14; Quest 2 Build/UP1A.231005.007.A1)	172.69.65.150	2026-03-25 02:04:12.312	2026-03-25 02:04:12.312	1
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-03-04 16:44:34
20211116045059	2026-03-04 16:44:35
20211116050929	2026-03-04 16:44:36
20211116051442	2026-03-04 16:44:37
20211116212300	2026-03-04 16:44:37
20211116213355	2026-03-04 16:44:38
20211116213934	2026-03-04 16:44:39
20211116214523	2026-03-04 16:44:39
20211122062447	2026-03-04 16:44:40
20211124070109	2026-03-04 16:44:41
20211202204204	2026-03-04 16:44:41
20211202204605	2026-03-04 16:44:42
20211210212804	2026-03-04 16:44:44
20211228014915	2026-03-04 16:44:45
20220107221237	2026-03-04 16:44:45
20220228202821	2026-03-04 16:44:46
20220312004840	2026-03-04 16:44:46
20220603231003	2026-03-04 16:44:47
20220603232444	2026-03-04 16:44:48
20220615214548	2026-03-04 16:44:49
20220712093339	2026-03-04 16:44:49
20220908172859	2026-03-04 16:44:50
20220916233421	2026-03-04 16:44:51
20230119133233	2026-03-04 16:44:51
20230128025114	2026-03-04 16:44:52
20230128025212	2026-03-04 16:44:53
20230227211149	2026-03-04 16:44:53
20230228184745	2026-03-04 16:44:54
20230308225145	2026-03-04 16:44:55
20230328144023	2026-03-04 16:44:55
20231018144023	2026-03-04 16:44:56
20231204144023	2026-03-04 16:44:57
20231204144024	2026-03-04 16:44:58
20231204144025	2026-03-04 16:44:58
20240108234812	2026-03-04 16:44:59
20240109165339	2026-03-04 16:44:59
20240227174441	2026-03-04 16:45:01
20240311171622	2026-03-04 16:45:01
20240321100241	2026-03-04 16:45:03
20240401105812	2026-03-04 16:45:05
20240418121054	2026-03-04 16:45:05
20240523004032	2026-03-04 16:45:08
20240618124746	2026-03-04 16:45:08
20240801235015	2026-03-04 16:45:09
20240805133720	2026-03-04 16:45:09
20240827160934	2026-03-04 16:45:10
20240919163303	2026-03-04 16:45:11
20240919163305	2026-03-04 16:45:12
20241019105805	2026-03-04 16:45:12
20241030150047	2026-03-04 16:45:15
20241108114728	2026-03-04 16:45:15
20241121104152	2026-03-04 16:45:16
20241130184212	2026-03-04 16:45:17
20241220035512	2026-03-04 16:45:17
20241220123912	2026-03-04 16:45:18
20241224161212	2026-03-04 16:45:19
20250107150512	2026-03-04 16:45:19
20250110162412	2026-03-04 16:45:20
20250123174212	2026-03-04 16:45:20
20250128220012	2026-03-04 16:45:21
20250506224012	2026-03-04 16:45:22
20250523164012	2026-03-04 16:45:22
20250714121412	2026-03-04 16:45:23
20250905041441	2026-03-04 16:45:23
20251103001201	2026-03-04 16:45:24
20251120212548	2026-03-04 16:45:25
20251120215549	2026-03-04 16:45:26
20260218120000	2026-03-04 16:45:26
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-03-04 16:43:37.195079
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-03-04 16:43:37.22782
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-03-04 16:43:37.230155
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-03-04 16:43:37.256413
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-03-04 16:43:37.31771
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-03-04 16:43:37.320143
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-03-04 16:43:37.323471
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-03-04 16:43:37.326827
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-03-04 16:43:37.329483
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-03-04 16:43:37.331704
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-03-04 16:43:37.334058
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-03-04 16:43:37.337028
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-03-04 16:43:37.340472
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-03-04 16:43:37.34276
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-03-04 16:43:37.345237
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-03-04 16:43:37.370455
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-03-04 16:43:37.373069
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-03-04 16:43:37.376647
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-03-04 16:43:37.379286
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-03-04 16:43:37.384309
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-03-04 16:43:37.386682
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-03-04 16:43:37.390694
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-03-04 16:43:37.401892
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-03-04 16:43:37.409678
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-03-04 16:43:37.412142
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-03-04 16:43:37.414461
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-03-04 16:43:37.41673
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-03-04 16:43:37.418683
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-03-04 16:43:37.420665
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-03-04 16:43:37.42268
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-03-04 16:43:37.424647
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-03-04 16:43:37.426662
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-03-04 16:43:37.428585
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-03-04 16:43:37.4303
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-03-04 16:43:37.432244
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-03-04 16:43:37.434098
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-03-04 16:43:37.438478
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-03-04 16:43:37.440683
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-03-04 16:43:37.445999
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-03-04 16:43:37.456345
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-03-04 16:43:37.45918
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-03-04 16:43:37.461016
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-03-04 16:43:37.462979
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-03-04 16:43:37.465099
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-03-04 16:43:37.467529
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-03-04 16:43:37.470675
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-03-04 16:43:37.480958
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-03-04 16:43:37.484225
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-03-04 16:43:37.486256
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-03-04 16:43:37.499077
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-03-04 16:43:37.503664
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-03-04 16:43:37.959434
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-03-04 16:43:37.961218
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-03-04 16:43:37.974346
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-03-04 16:43:37.976609
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-03-04 16:43:37.977858
56	fix-optimized-search-function	cb58526ebc23048049fd5bf2fd148d18b04a2073	2026-03-04 16:43:37.98096
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: analytics_daily_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.analytics_daily_id_seq', 1, false);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 6, true);


--
-- Name: comment_replies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comment_replies_id_seq', 1, false);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, true);


--
-- Name: contact_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_submissions_id_seq', 1, true);


--
-- Name: contents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contents_id_seq', 26, true);


--
-- Name: faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faqs_id_seq', 2, true);


--
-- Name: gallery_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gallery_categories_id_seq', 4, true);


--
-- Name: gallery_of_works_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gallery_of_works_id_seq', 4, true);


--
-- Name: login_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_attempts_id_seq', 46, true);


--
-- Name: login_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_logs_id_seq', 5, true);


--
-- Name: media_gallery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.media_gallery_id_seq', 46, true);


--
-- Name: navigation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.navigation_id_seq', 12, true);


--
-- Name: page_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.page_sections_id_seq', 6, true);


--
-- Name: page_views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.page_views_id_seq', 400, true);


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pages_id_seq', 1, true);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.settings_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: visitors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.visitors_id_seq', 163, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: analytics_daily analytics_daily_date_page_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_daily
    ADD CONSTRAINT analytics_daily_date_page_slug_key UNIQUE (date, page_slug);


--
-- Name: analytics_daily analytics_daily_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_daily
    ADD CONSTRAINT analytics_daily_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: comment_replies comment_replies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_replies
    ADD CONSTRAINT comment_replies_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- Name: contents contents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT contents_pkey PRIMARY KEY (id);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: gallery_categories gallery_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_categories
    ADD CONSTRAINT gallery_categories_pkey PRIMARY KEY (id);


--
-- Name: gallery_categories gallery_categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_categories
    ADD CONSTRAINT gallery_categories_slug_key UNIQUE (slug);


--
-- Name: gallery_of_works gallery_of_works_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_of_works
    ADD CONSTRAINT gallery_of_works_pkey PRIMARY KEY (id);


--
-- Name: login_attempts login_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_attempts
    ADD CONSTRAINT login_attempts_pkey PRIMARY KEY (id);


--
-- Name: login_logs login_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_logs
    ADD CONSTRAINT login_logs_pkey PRIMARY KEY (id);


--
-- Name: media_gallery media_gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_gallery
    ADD CONSTRAINT media_gallery_pkey PRIMARY KEY (id);


--
-- Name: navigation navigation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.navigation
    ADD CONSTRAINT navigation_pkey PRIMARY KEY (id);


--
-- Name: page_sections page_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_sections
    ADD CONSTRAINT page_sections_pkey PRIMARY KEY (id);


--
-- Name: page_views page_views_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_views
    ADD CONSTRAINT page_views_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: visitors visitors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_pkey PRIMARY KEY (id);


--
-- Name: visitors visitors_visitor_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_visitor_id_key UNIQUE (visitor_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- Name: categories_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX categories_slug_idx ON public.categories USING btree (slug) WHERE (deleted_at IS NULL);


--
-- Name: contents_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX contents_slug_idx ON public.contents USING btree (slug) WHERE (deleted_at IS NULL);


--
-- Name: idx_analytics_daily_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_daily_date ON public.analytics_daily USING btree (date);


--
-- Name: idx_analytics_daily_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_daily_slug ON public.analytics_daily USING btree (page_slug);


--
-- Name: idx_audit_logs_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at);


--
-- Name: idx_audit_logs_entity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_entity ON public.audit_logs USING btree (entity_type, entity_id);


--
-- Name: idx_audit_logs_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (user_id);


--
-- Name: idx_gallery_cat_deleted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gallery_cat_deleted ON public.gallery_categories USING btree (deleted_at);


--
-- Name: idx_gallery_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gallery_category ON public.gallery_of_works USING btree (category_id);


--
-- Name: idx_gallery_deleted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gallery_deleted ON public.gallery_of_works USING btree (deleted_at);


--
-- Name: idx_gallery_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gallery_order ON public.gallery_of_works USING btree (display_order);


--
-- Name: idx_login_attempts_identifier_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_login_attempts_identifier_time ON public.login_attempts USING btree (identifier, attempted_at DESC);


--
-- Name: idx_login_logs_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_login_logs_created_at ON public.login_logs USING btree (created_at);


--
-- Name: idx_login_logs_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_login_logs_user_id ON public.login_logs USING btree (user_id);


--
-- Name: idx_page_views_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_page_views_created_at ON public.page_views USING btree (created_at);


--
-- Name: idx_page_views_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_page_views_slug ON public.page_views USING btree (page_slug);


--
-- Name: idx_page_views_visitor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_page_views_visitor ON public.page_views USING btree (visitor_id);


--
-- Name: idx_visitors_first_visit; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_visitors_first_visit ON public.visitors USING btree (first_visit);


--
-- Name: idx_visitors_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_visitors_id ON public.visitors USING btree (visitor_id);


--
-- Name: idx_visitors_last_visit; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_visitors_last_visit ON public.visitors USING btree (last_visit);


--
-- Name: page_sections_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX page_sections_slug_idx ON public.page_sections USING btree (page_slug) WHERE (deleted_at IS NULL);


--
-- Name: pages_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX pages_slug_idx ON public.pages USING btree (slug) WHERE (deleted_at IS NULL);


--
-- Name: settings_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX settings_key_idx ON public.settings USING btree (key);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_key ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: login_logs fk_login_logs_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_logs
    ADD CONSTRAINT fk_login_logs_user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: gallery_of_works gallery_of_works_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_of_works
    ADD CONSTRAINT gallery_of_works_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.gallery_categories(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: login_attempts Service role can manage login attempts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Service role can manage login attempts" ON public.login_attempts USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: analytics_daily; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.analytics_daily ENABLE ROW LEVEL SECURITY;

--
-- Name: login_attempts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION pg_reload_conf(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_reload_conf() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE webauthn_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_challenges TO postgres;
GRANT ALL ON TABLE auth.webauthn_challenges TO dashboard_user;


--
-- Name: TABLE webauthn_credentials; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_credentials TO postgres;
GRANT ALL ON TABLE auth.webauthn_credentials TO dashboard_user;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE analytics_daily; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.analytics_daily TO anon;
GRANT ALL ON TABLE public.analytics_daily TO authenticated;
GRANT ALL ON TABLE public.analytics_daily TO service_role;


--
-- Name: SEQUENCE analytics_daily_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.analytics_daily_id_seq TO anon;
GRANT ALL ON SEQUENCE public.analytics_daily_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.analytics_daily_id_seq TO service_role;


--
-- Name: TABLE audit_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.audit_logs TO anon;
GRANT ALL ON TABLE public.audit_logs TO authenticated;
GRANT ALL ON TABLE public.audit_logs TO service_role;


--
-- Name: SEQUENCE audit_logs_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.audit_logs_id_seq TO anon;
GRANT ALL ON SEQUENCE public.audit_logs_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.audit_logs_id_seq TO service_role;


--
-- Name: TABLE categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.categories TO anon;
GRANT ALL ON TABLE public.categories TO authenticated;
GRANT ALL ON TABLE public.categories TO service_role;


--
-- Name: SEQUENCE categories_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.categories_id_seq TO anon;
GRANT ALL ON SEQUENCE public.categories_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.categories_id_seq TO service_role;


--
-- Name: TABLE comment_replies; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.comment_replies TO anon;
GRANT ALL ON TABLE public.comment_replies TO authenticated;
GRANT ALL ON TABLE public.comment_replies TO service_role;


--
-- Name: SEQUENCE comment_replies_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.comment_replies_id_seq TO anon;
GRANT ALL ON SEQUENCE public.comment_replies_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.comment_replies_id_seq TO service_role;


--
-- Name: TABLE comments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.comments TO anon;
GRANT ALL ON TABLE public.comments TO authenticated;
GRANT ALL ON TABLE public.comments TO service_role;


--
-- Name: SEQUENCE comments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.comments_id_seq TO anon;
GRANT ALL ON SEQUENCE public.comments_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.comments_id_seq TO service_role;


--
-- Name: TABLE contact_submissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.contact_submissions TO anon;
GRANT ALL ON TABLE public.contact_submissions TO authenticated;
GRANT ALL ON TABLE public.contact_submissions TO service_role;


--
-- Name: SEQUENCE contact_submissions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.contact_submissions_id_seq TO anon;
GRANT ALL ON SEQUENCE public.contact_submissions_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.contact_submissions_id_seq TO service_role;


--
-- Name: TABLE contents; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.contents TO anon;
GRANT ALL ON TABLE public.contents TO authenticated;
GRANT ALL ON TABLE public.contents TO service_role;


--
-- Name: SEQUENCE contents_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.contents_id_seq TO anon;
GRANT ALL ON SEQUENCE public.contents_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.contents_id_seq TO service_role;


--
-- Name: TABLE faqs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.faqs TO anon;
GRANT ALL ON TABLE public.faqs TO authenticated;
GRANT ALL ON TABLE public.faqs TO service_role;


--
-- Name: SEQUENCE faqs_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.faqs_id_seq TO anon;
GRANT ALL ON SEQUENCE public.faqs_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.faqs_id_seq TO service_role;


--
-- Name: TABLE gallery_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.gallery_categories TO anon;
GRANT ALL ON TABLE public.gallery_categories TO authenticated;
GRANT ALL ON TABLE public.gallery_categories TO service_role;


--
-- Name: SEQUENCE gallery_categories_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.gallery_categories_id_seq TO anon;
GRANT ALL ON SEQUENCE public.gallery_categories_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.gallery_categories_id_seq TO service_role;


--
-- Name: TABLE gallery_of_works; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.gallery_of_works TO anon;
GRANT ALL ON TABLE public.gallery_of_works TO authenticated;
GRANT ALL ON TABLE public.gallery_of_works TO service_role;


--
-- Name: SEQUENCE gallery_of_works_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.gallery_of_works_id_seq TO anon;
GRANT ALL ON SEQUENCE public.gallery_of_works_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.gallery_of_works_id_seq TO service_role;


--
-- Name: TABLE login_attempts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.login_attempts TO anon;
GRANT ALL ON TABLE public.login_attempts TO authenticated;
GRANT ALL ON TABLE public.login_attempts TO service_role;


--
-- Name: SEQUENCE login_attempts_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.login_attempts_id_seq TO anon;
GRANT ALL ON SEQUENCE public.login_attempts_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.login_attempts_id_seq TO service_role;


--
-- Name: TABLE login_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.login_logs TO anon;
GRANT ALL ON TABLE public.login_logs TO authenticated;
GRANT ALL ON TABLE public.login_logs TO service_role;


--
-- Name: SEQUENCE login_logs_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.login_logs_id_seq TO anon;
GRANT ALL ON SEQUENCE public.login_logs_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.login_logs_id_seq TO service_role;


--
-- Name: TABLE media_gallery; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.media_gallery TO anon;
GRANT ALL ON TABLE public.media_gallery TO authenticated;
GRANT ALL ON TABLE public.media_gallery TO service_role;


--
-- Name: SEQUENCE media_gallery_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.media_gallery_id_seq TO anon;
GRANT ALL ON SEQUENCE public.media_gallery_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.media_gallery_id_seq TO service_role;


--
-- Name: TABLE navigation; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.navigation TO anon;
GRANT ALL ON TABLE public.navigation TO authenticated;
GRANT ALL ON TABLE public.navigation TO service_role;


--
-- Name: SEQUENCE navigation_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.navigation_id_seq TO anon;
GRANT ALL ON SEQUENCE public.navigation_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.navigation_id_seq TO service_role;


--
-- Name: TABLE page_sections; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.page_sections TO anon;
GRANT ALL ON TABLE public.page_sections TO authenticated;
GRANT ALL ON TABLE public.page_sections TO service_role;


--
-- Name: SEQUENCE page_sections_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.page_sections_id_seq TO anon;
GRANT ALL ON SEQUENCE public.page_sections_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.page_sections_id_seq TO service_role;


--
-- Name: TABLE page_views; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.page_views TO anon;
GRANT ALL ON TABLE public.page_views TO authenticated;
GRANT ALL ON TABLE public.page_views TO service_role;


--
-- Name: SEQUENCE page_views_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.page_views_id_seq TO anon;
GRANT ALL ON SEQUENCE public.page_views_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.page_views_id_seq TO service_role;


--
-- Name: TABLE pages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pages TO anon;
GRANT ALL ON TABLE public.pages TO authenticated;
GRANT ALL ON TABLE public.pages TO service_role;


--
-- Name: SEQUENCE pages_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.pages_id_seq TO anon;
GRANT ALL ON SEQUENCE public.pages_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.pages_id_seq TO service_role;


--
-- Name: TABLE settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.settings TO anon;
GRANT ALL ON TABLE public.settings TO authenticated;
GRANT ALL ON TABLE public.settings TO service_role;


--
-- Name: SEQUENCE settings_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.settings_id_seq TO anon;
GRANT ALL ON SEQUENCE public.settings_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.settings_id_seq TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_id_seq TO anon;
GRANT ALL ON SEQUENCE public.users_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.users_id_seq TO service_role;


--
-- Name: TABLE visitors; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.visitors TO anon;
GRANT ALL ON TABLE public.visitors TO authenticated;
GRANT ALL ON TABLE public.visitors TO service_role;


--
-- Name: SEQUENCE visitors_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.visitors_id_seq TO anon;
GRANT ALL ON SEQUENCE public.visitors_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.visitors_id_seq TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict uDrYNeHbahOd65QAu4jlS5fujTuhXTDc1YKxI5x3Rr3C0NYbSx9EQ526NwklVKr

