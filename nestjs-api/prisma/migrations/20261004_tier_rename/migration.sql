-- Migration: Rename tiers and add firebaseUid
-- 1. Add firebaseUid column (nullable first)
ALTER TABLE `User` ADD COLUMN `firebaseUid` VARCHAR(191) NULL;

-- 2. Update existing users: set firebaseUid to their current id (UUID)
-- This assumes existing users' IDs will be used as firebaseUid for backward compatibility
-- In production, you'd map these to actual Firebase UIDs
UPDATE `User` SET `firebaseUid` = `id` WHERE `firebaseUid` IS NULL;

-- 3. Make firebaseUid unique and not null
ALTER TABLE `User` MODIFY COLUMN `firebaseUid` VARCHAR(191) NOT NULL;
CREATE UNIQUE INDEX `User_firebaseUid_key` ON `User`(`firebaseUid`);

-- 4. Drop passwordHash column (no longer needed with Firebase Auth)
ALTER TABLE `User` DROP COLUMN `passwordHash`;

-- 5. Update tier values: FREE -> STARTER, PRO -> GROWTH
UPDATE `User` SET `tier` = 'STARTER' WHERE `tier` = 'FREE';
UPDATE `User` SET `tier` = 'GROWTH' WHERE `tier` = 'PRO';
-- ENTERPRISE stays as ENTERPRISE

-- 6. Update Content table userId references if needed (they reference User.id)
-- Since we kept the same UUID as firebaseUid, no changes needed for foreign keys