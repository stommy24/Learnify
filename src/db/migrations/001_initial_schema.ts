import { Prisma } from '@prisma/client';

export const up = async (prisma: Prisma.TransactionClient) => {
  await prisma.$executeRaw`
    -- Users table
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      role VARCHAR(50) NOT NULL,
      avatar_url TEXT,
      last_login TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Subjects table
    CREATE TABLE subjects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      description TEXT,
      year_group INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Assessments table
    CREATE TABLE assessments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      subject_id UUID REFERENCES subjects(id),
      created_by UUID REFERENCES users(id),
      year_group INTEGER NOT NULL,
      duration INTEGER NOT NULL, -- in minutes
      total_points INTEGER NOT NULL,
      passing_score INTEGER NOT NULL,
      status VARCHAR(50) NOT NULL,
      due_date TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Questions table
    CREATE TABLE questions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      assessment_id UUID REFERENCES assessments(id),
      question_type VARCHAR(50) NOT NULL,
      text TEXT NOT NULL,
      points INTEGER NOT NULL,
      correct_answer TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Question options table (for multiple choice questions)
    CREATE TABLE question_options (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      question_id UUID REFERENCES questions(id),
      text TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Assessment submissions table
    CREATE TABLE submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      assessment_id UUID REFERENCES assessments(id),
      student_id UUID REFERENCES users(id),
      status VARCHAR(50) NOT NULL,
      score INTEGER,
      submitted_at TIMESTAMP WITH TIME ZONE,
      graded_at TIMESTAMP WITH TIME ZONE,
      graded_by UUID REFERENCES users(id),
      feedback TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Submission answers table
    CREATE TABLE submission_answers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      submission_id UUID REFERENCES submissions(id),
      question_id UUID REFERENCES questions(id),
      answer_text TEXT NOT NULL,
      points_awarded INTEGER,
      feedback TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes for better query performance
    CREATE INDEX idx_assessments_subject_id ON assessments(subject_id);
    CREATE INDEX idx_assessments_created_by ON assessments(created_by);
    CREATE INDEX idx_questions_assessment_id ON questions(assessment_id);
    CREATE INDEX idx_submissions_assessment_id ON submissions(assessment_id);
    CREATE INDEX idx_submissions_student_id ON submissions(student_id);
    CREATE INDEX idx_submission_answers_submission_id ON submission_answers(submission_id);
    CREATE INDEX idx_submission_answers_question_id ON submission_answers(question_id);

    -- Add triggers for updated_at timestamps
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_assessments_updated_at
        BEFORE UPDATE ON assessments
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_submissions_updated_at
        BEFORE UPDATE ON submissions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  `;
};

export const down = async (prisma: Prisma.TransactionClient) => {
  await prisma.$executeRaw`
    -- Drop triggers first
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    DROP TRIGGER IF EXISTS update_assessments_updated_at ON assessments;
    DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
    DROP FUNCTION IF EXISTS update_updated_at_column();

    -- Drop tables in correct order due to foreign key constraints
    DROP TABLE IF EXISTS submission_answers CASCADE;
    DROP TABLE IF EXISTS submissions CASCADE;
    DROP TABLE IF EXISTS question_options CASCADE;
    DROP TABLE IF EXISTS questions CASCADE;
    DROP TABLE IF EXISTS assessments CASCADE;
    DROP TABLE IF EXISTS subjects CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
  `;
}; 