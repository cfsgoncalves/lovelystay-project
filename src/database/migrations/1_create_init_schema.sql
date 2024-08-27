CREATE TABLE public.users (
	username varchar(100) NOT NULL,
	profile_url varchar(100) NULL,
	CONSTRAINT user_pk PRIMARY KEY (username)
);

CREATE TABLE public.user_programming_languages (
    languageName varchar(100) NOT NULL,
    username varchar(100) NOT NULL,
    CONSTRAINT user_programming_languages_pk PRIMARY KEY (username),
    CONSTRAINT user_programming_languages_fk FOREIGN KEY (username) REFERENCES public.users(username)
);
