CREATE TABLE public.users (
	username varchar(100) NOT NULL,
	profile_url varchar(100) NULL,
    location varchar(100) NULL,
    repos_url varchar(100) NULL,
    created_at timestamp NOT NULL,
	CONSTRAINT user_pk PRIMARY KEY (username)
);

CREATE TABLE public.user_programming_languages (
    language_name varchar(100) NOT NULL,
    username varchar(100) NOT NULL,
    CONSTRAINT user_programming_languages_pk PRIMARY KEY (username, language_name),
    CONSTRAINT user_programming_languages_fk FOREIGN KEY (username) REFERENCES public.users(username)
);
