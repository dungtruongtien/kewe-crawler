-- Create the kewe_crawling database
CREATE DATABASE kewe_crawling;

-- Connect to the kewe_crawling database
\c kewe_crawling;
-- public."user" definition

-- Drop table

-- DROP TABLE public."user";

CREATE TABLE public."user" (
	id serial4 NOT NULL,
	"name" varchar(255) NULL,
	email varchar(255) NULL,
	"fullName" varchar(255) NULL,
	"password" varchar(255) NULL,
	dob timestamptz NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT user_pkey PRIMARY KEY (id),
	CONSTRAINT user_un UNIQUE (email)
);

-- public.auth definition

-- Drop table

-- DROP TABLE public.auth;

CREATE TABLE public.auth (
	id serial4 NOT NULL,
	"userId" int4 NULL,
	"refreshToken" varchar(255) NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT auth_pkey PRIMARY KEY (id),
	CONSTRAINT auth_un UNIQUE ("userId")
);

-- public.keyword definition

-- Drop table

-- DROP TABLE public.keyword;

CREATE TABLE public.keyword (
	id serial4 NOT NULL,
	"userId" int4 NULL,
	"totalAdWordsAdvertisers" int4 NULL,
	"adWordsAdvertisers" json NULL,
	"totalLinks" int4 NULL,
	links json NULL,
	"searchResultStatistics" varchar(255) NULL,
	"htmlStaticLink" varchar(255) NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	keyword varchar NULL,
	CONSTRAINT keyword_pkey PRIMARY KEY (id)
);


-- public.keyword foreign keys

ALTER TABLE public.keyword ADD CONSTRAINT "keyword_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE ON UPDATE CASCADE;


INSERT INTO public."user" ("name",email,"fullName","password",dob,"createdAt","updatedAt") VALUES
	 (NULL,'admin@gmail.com','admin','$2b$10$Stupj3D8eRK6Qx.07ONmxeT1ktZSNEImTGVtJ/ZyzfSQzsYRWIfBe',NULL,'2023-11-11 13:37:49.659+07','2023-11-11 13:37:49.659+07'),
	 (NULL,'admin1@gmail.com',NULL,'$2b$10$sdFRUNLivxI9xRwVElvPd.HAcU4k8jYfTdPM3VdIfNgdWGVuAIcee',NULL,'2023-11-13 16:55:46.774+07','2023-11-13 16:55:46.774+07');
