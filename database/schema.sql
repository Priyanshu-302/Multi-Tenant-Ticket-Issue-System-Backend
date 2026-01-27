-- Organization table --> For multi tenant(companies)
create table
    organization (
        id serial primary key,
        name text not null unique,
        created_at timestamp default current_timestamp
    );

-- User Table --> One user can only be associated to one organization only
create table
    users (
        id serial primary key,
        name text not null,
        email text not null unique,
        password text not null,
        is_active boolean default true,
        created_at timestamp default current_timestamp
    );

-- Membership Table --> Forms relationship between user <-> organization <-> role
create table
    membership (
        id serial primary key,
        user_id integer references users (id),
        org_id integer references organization (id),
        role text not null check (role in ('ADMIN', 'AGENT', 'USER')),
        created_at timestamp default current_timestamp,
        unique (user_id, org_id)
    );

-- Ticket Table --> A ticket must be associated with an organization then the admin decides which agent to give the ticket to resolve
create table
    tickets (
        id serial primary key,
        org_id integer references organization (id),
        title text not null unique,
        description text not null,
        status text not null check (
            status in ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')
        ),
        priority text not null check (priority in ('LOW', 'MEDIUM', 'HIGH')),
        created_by integer references users (id),
        assigned_to integer references users (id),
        created_at timestamp default current_timestamp
    );

-- Ticket History --> It is used for storing the history of the ticket like what was the last update and when was the new update.
create table
    ticket_history (
        id serial primary key,
        ticket_id integer references tickets (id),
        new_status text not null,
        changed_by integer references users (id),
        changed_at timestamp default now ()
    );