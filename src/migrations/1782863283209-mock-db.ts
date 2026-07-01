import { MigrationInterface, QueryRunner } from "typeorm";

export class MockDb1782863283209 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public.menus
            (id, created_at, updated_at, deleted_at, metadata)
            VALUES('0a58f456-43b8-4072-8c96-ad1e54632605'::uuid, '2026-06-29 09:08:18.906', '2026-06-29 09:08:18.906', NULL, '[{"id": "home", "icon": "Home", "path": "/", "label": "Home"}, {"id": "projects", "icon": "FolderKanban", "path": "/project", "label": "Projects"}, {"id": "tasks", "icon": "CheckSquare", "path": "/task", "badge": 12, "label": "My Tasks"}, {"id": "team", "icon": "Users", "path": "/team", "label": "Team Management"}, {"id": "reports", "icon": "BarChart3", "path": "/report", "label": "Reports"}, {"id": "settings", "icon": "Settings", "path": "/setting", "label": "System Settings"}]'::jsonb)
            ON CONFLICT (id) DO NOTHING;
            INSERT INTO public.menus
            (id, created_at, updated_at, deleted_at, metadata)
            VALUES('4c524510-48f9-47ee-853b-d95af5f1c2f4'::uuid, '2026-06-29 09:08:18.906', '2026-06-29 09:08:18.906', NULL, '[{"id": "home", "icon": "Home", "path": "/", "label": "Home"}, {"id": "tasks", "icon": "CheckSquare", "path": "/task", "badge": 12, "label": "My Tasks"}, {"id": "reports", "icon": "BarChart3", "path": "/report", "label": "Reports"}, {"id": "settings", "icon": "Settings", "path": "/setting", "label": "System Settings"}]'::jsonb)
            ON CONFLICT (id) DO NOTHING;
        `)

        await queryRunner.query(`
            INSERT INTO public.users
            (id, metadata, "name", username, password_hash, email, phone_number, "role", menu_id, created_at, updated_at, deleted_at)
            VALUES('bdfeadf1-e4a9-49a7-932d-d29ed10442a4'::uuid, NULL, 'Staff', 'Staff', '$2b$10$2O2axHRGCyjDNopZPYLmhut0xewbCI8Jsk61WMwPFFTVaCJDP3yhe', 'staff@gmail.com', '12344567888', 'staff'::public.users_role_enum, '4c524510-48f9-47ee-853b-d95af5f1c2f4'::uuid, '2026-07-01 06:59:05.682', '2026-07-01 06:59:05.682', NULL)
            ON CONFLICT (id) DO NOTHING;
            INSERT INTO public.users
            (id, metadata, "name", username, password_hash, email, phone_number, "role", menu_id, created_at, updated_at, deleted_at)
            VALUES('ed8de0cb-fc5e-4980-b82d-a342cd20e626'::uuid, NULL, 'Manager', 'Manager', '$2b$10$adnOTQpO8CZyRebj3oEFHui2VpOLO9VwdwIyNxJ1on6o.RHuEPcEa', 'manager@gmail.com', '123456787', 'manager'::public.users_role_enum, '4c524510-48f9-47ee-853b-d95af5f1c2f4'::uuid, '2026-07-01 06:58:35.994', '2026-07-01 06:58:35.994', NULL)
            ON CONFLICT (id) DO NOTHING;
            INSERT INTO public.users
            (id, metadata, "name", username, password_hash, email, phone_number, "role", menu_id, created_at, updated_at, deleted_at)
            VALUES('c527c787-cad2-4f08-b0a2-19db43306fd1'::uuid, NULL, 'Admin', 'Admin', '$2b$10$P/vGYIbtIf1SwS9liPmg.u/ZYRIwuK8SlxuphybxMhegB/hRtdsku', 'admin@gmail.com', '12345678', 'admin'::public.users_role_enum, '0a58f456-43b8-4072-8c96-ad1e54632605'::uuid, '2026-07-01 06:57:29.379', '2026-07-01 06:57:46.057', NULL)
            ON CONFLICT (id) DO NOTHING;
        `)
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
    }

}
