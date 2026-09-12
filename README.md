# Dar Al Sharq CMS

A production-minded content-management assignment built with Laravel 12, PHP 8.2+, Laravel Sanctum, React 19, CKEditor 5 and Swagger/OpenAPI.

## Implemented requirements

- Sanctum first-party session authentication.
- Database-driven users, roles and privileges; authorization is based on privileges rather than hard-coded role names.
- Administrator CRUD for pages, users, roles and privileges.
- Moderator page list/create/update workflow without page delete or user/role/privilege management.
- Pages with title, slug, CKEditor body, cover image, draft/published state and optional publish date.
- Scheduled visibility: published pages with a future `publish_at` are hidden from the public API until due.
- Page audit fields (`created_by`, `updated_by`, `deleted_by`) plus soft-delete, Admin restore and permanent delete.
- Paginated page API with title search plus status and menu filters.
- Sortable, nestable dynamic menu linked to pages; public navigation reflects persisted order and nesting.
- Public React site with an editable CMS home page and root-level page URLs such as `/about-us`.
- CKEditor image uploads to Laravel public storage and server-side HTML sanitization.
- Structured page blocks (carousel, image/text, CTA, gallery/lightbox, video, FAQ, cards, quote, divider and button) as an additional CMS feature.
- Live page preview in the page editor and a collapsible CMS sidebar.
- Custom helper `page_public_url()` used by the page API resource.
- Model factories, database migrations and seed data.
- Swagger/OpenAPI documentation served by the application.
- PHPUnit feature/unit tests plus Vitest frontend tests.

## Requirements

- PHP 8.2+
- Composer
- Node.js and npm
- MySQL 8+ or PostgreSQL (the committed example configuration uses MySQL)

## Clean checkout setup

The assignment requires MySQL or PostgreSQL. The committed `.env.example` is configured for MySQL.

### 1. Create the database

Using MySQL:

```sql
CREATE DATABASE dar_al_sharq CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Prepare the application

```bash
git clone <repository-url>
cd Dar-al-Sharq_Assignment
composer run setup
```

`composer run setup` installs PHP and JavaScript dependencies, creates `.env` when it does not exist, generates the application key, creates the public storage link, generates Swagger documentation, and builds the frontend.

### 3. Configure database credentials

Open `.env` and verify/update:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dar_al_sharq
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Run migrations and seeders

```bash
php artisan migrate --seed
php artisan serve
```

For frontend development, run this in another terminal:

```bash
npm run dev
```

Open `http://127.0.0.1:8000` unless Laravel was started on another host/port.

> Automated tests use an in-memory SQLite database through `phpunit.xml`. SQLite is used only for isolated tests; the application configuration and documented runtime database use MySQL as required by the assignment.

## Seeded login credentials

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@example.com` | `password` |
| Moderator | `moderator@example.com` | `password` |

These credentials are intended for local/demo use only. Change them for any public deployment.

## Main routes

- Public site: `/`
- Public CMS pages: `/{slug}` (for example `/about-us`)
- CMS sign-in: `/login`
- Administrator workspace: `/admin`
- Moderator workspace: `/moderator`
- Swagger UI: `/api/documentation`

## API behavior

The authenticated page list supports:

- `search` — title search
- `status` — `draft`, `published`, or `scheduled`
- `menu_id` — pages linked to a menu item
- `per_page` — pagination size, capped at 100

Public endpoints only expose pages that are both `published` and due. Draft, future-scheduled and soft-deleted pages are excluded.

## Authorization

Privileges are stored as data and assigned through roles. The seeded Moderator receives only:

- `pages.view`
- `pages.create`
- `pages.update`

The seeded Administrator receives all seeded privileges, including page restore/permanent-delete and user/role/privilege/menu management.

## Storage and editor images

Cover images and CKEditor/page-block images use Laravel's `public` filesystem disk. Run:

```bash
php artisan storage:link
```

The editor upload endpoint accepts JPG, PNG and WebP files up to 8 MB and requires authenticated page-update privilege.

## Swagger / OpenAPI

OpenAPI attributes are maintained in:

```text
app/OpenApi/Documentation.php
```

Generate the spec after API changes:

```bash
php artisan l5-swagger:generate
```

Then open:

```text
/api/documentation
```

## Tests

Run the complete verification suite with:

```bash
php artisan test
npm test -- --run
npm run build
php artisan l5-swagger:generate
```

For a clean database verification:

```bash
php artisan migrate:fresh --seed
```

`migrate:fresh` destroys the configured database, so use it only on a local/test database.

## Production build

Build React/Vite assets with:

```bash
npm ci
npm run build
php artisan migrate --force
php artisan storage:link
php artisan l5-swagger:generate
php artisan optimize
```

In production, point Nginx/Apache at Laravel's `public/` directory and use PHP-FPM. Do not run the Vite development server.

## Project structure

- `app/Http/Controllers` — API logic
- `app/Http/Requests` — request validation
- `app/Http/Resources` — API response shaping
- `app/Models` — Eloquent models and publishing relationships/scopes
- `app/Services` — HTML and structured-block sanitization
- `app/Support/helpers.php` — custom application helper
- `app/OpenApi/Documentation.php` — Swagger/OpenAPI attributes
- `database/migrations` — database schema
- `database/factories` — model factories
- `database/seeders` — seeded roles, privileges, users and home page
- `resources/js` — React CMS and public frontend
- `tests/Feature` / `tests/Unit` — Laravel automated tests
- `tests/Frontend` — Vitest/Testing Library tests

## Publishing implementation note

Scheduled publishing is implemented with query-time visibility checks. A page becomes public automatically once `publish_at <= now()`; no background scheduler is required for the core assignment behavior.

## Sharing with another developer

Give the developer access to the GitHub repository. After cloning, they should:

1. Create a MySQL database named `dar_al_sharq` (or another name of their choice).
2. Run `composer run setup`.
3. Set their own MySQL credentials in `.env`.
4. Run `php artisan migrate --seed`.
5. Run `php artisan serve`.

Example:

```bash
git clone <repository-url>
cd Dar-al-Sharq_Assignment
composer run setup
php artisan migrate --seed
php artisan serve
```

Local files such as `.env`, `vendor/`, `node_modules/`, `public/build/`, logs and test caches are intentionally excluded from Git. Each developer uses their own MySQL/PostgreSQL database and local environment configuration.
