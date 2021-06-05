-- 1. Modification of death_record table index

drop
index record_number on death_record;

create
unique index record_number
	on death_record (record_number, report_date, report_id);

-- 2. Modification of covid_death_report table index
drop
index date on covid_death_report;

create
unique index date
	on covid_death_report (date, release_number);