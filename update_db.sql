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

-- 3. Press Release Has full report
alter table covid_death_report
    add has_full_detail_report boolean default true null;


-- 4. Press Release Has Summery report
alter table covid_death_report
    add has_summery_detail_report boolean default false null;

-- 5. Add summary table
alter table press_release_summary
    add report_id int(11) not null;
alter table press_release_summary
    add constraint press_release_summary_covid_death_report_id_fk
        foreign key (report_id) references covid_death_report (id)
            on update cascade on delete cascade;

-- 6. Add Default 0
alter table mini_death_record
    alter column `count` set default 0;
alter table age_group
    alter column `start` set default 0;
alter table age_group
    alter column `end` set default 0;
alter table age_group
    alter column `count` set default 0;

-- 7. Add Note column to summary
alter table press_release_summary
    add note TEXT null;

-- 8. Add announced date to covid_death_report
alter table covid_death_report
    add announced_date date null;


-- 9. Update announced date to have same date of report date
UPDATE covid_death_report
SET announced_date= date
WHERE announced_date is null;

-- 10. add report type
alter table covid_death_report
	add report_type enum('Type_1', 'Type_2', 'Type_3') null;

-- 10.5 Set values to report type
UPDATE covid_death_report
SET report_type= 'Type_1'
WHERE has_full_detail_report;


UPDATE covid_death_report
SET report_type= 'Type_2'
WHERE has_summery_detail_report;

-- 11. remove unwanted data columns
alter table covid_death_report drop column has_full_detail_report;

alter table covid_death_report drop column has_summery_detail_report;




