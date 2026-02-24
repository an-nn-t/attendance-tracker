import pgPromise from 'pg-promise';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  console.error('DIRECT_URL is not set in .env');
  process.exit(1);
}

const pgp = pgPromise();
const db = pgp(connectionString);

async function addEmailColumn() {
  try {
    // emailカラムが存在するか確認
    const result = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User' AND column_name = 'email'
    `);

    if (result.length > 0) {
      console.log('emailカラムは既に存在します');
      await pgp.end();
      return;
    }

    // emailカラムを追加
    await db.query(`
      ALTER TABLE "User" ADD COLUMN "email" TEXT UNIQUE;
    `);

    console.log('✅ emailカラムを追加しました');
    await pgp.end();
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    await pgp.end();
    process.exit(1);
  }
}

addEmailColumn();
