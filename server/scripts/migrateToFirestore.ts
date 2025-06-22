import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import News from '../models/News';
import { firestore } from '../firebase';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function migrateNews() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const newsDocs = await News.find();
  for (const n of newsDocs) {
    const data = {
      title: n.title,
      content: n.content,
      summary: n.summary,
      image: n.image,
      publishDate: n.publishDate,
      isPublished: n.isPublished,
      category: n.category,
      createdBy: n.createdBy.toString(),
      createdAt: n.createdAt,
      updatedAt: n.updatedAt
    };
    await firestore.collection('news').doc(n._id.toString()).set(data);
    console.log(`Migrated: ${n.title}`);
  }
  await mongoose.disconnect();
}

migrateNews()
  .then(() => {
    console.log('Migration to Firestore completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Migration failed', err);
    process.exit(1);
  });
