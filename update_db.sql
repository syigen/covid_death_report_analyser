

-- 1. Modification of death_record table index

drop index record_number on death_record;

create unique index record_number
	on death_record (record_number, report_date, report_id);
