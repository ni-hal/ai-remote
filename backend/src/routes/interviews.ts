import { Router } from 'express';
import { db } from '../config/firebase';
import { model } from '../config/gemini';
import { Interview } from '../types';

const router = Router();

// Generate questions
router.post('/generate-questions', async (req, res) => {
  try {
    const { position, description, experience, techStack } = req.body;
    
    const prompt = `Generate 5 technical interview questions with answers for:
    Position: ${position}
    Description: ${description}
    Experience: ${experience} years
    Tech Stack: ${techStack}
    
    Return JSON array: [{"question": "...", "answer": "..."}]`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const questions = JSON.parse(text.replace(/```json|```/g, ''));
    
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// Create interview
router.post('/', async (req, res) => {
  try {
    const interview: Interview = req.body;
    const docRef = await db.collection('interviews').add({
      ...interview,
      createdAt: new Date(),
    });
    
    res.json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create interview' });
  }
});

// Get user interviews
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('interviews')
      .where('userId', '==', userId)
      .get();
    
    const interviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
});

export default router;