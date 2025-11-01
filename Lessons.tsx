import React, { useState, useMemo } from 'react';
import { Language, Lesson } from './types';
import { PageHeader } from './PageHeader';
import LearningPath from './LearningPath';
import LessonModal from './LessonModal';
import { lessonData } from './LessonData';

interface LessonsProps {
  nativeLanguage: Language;
  learningLanguage: Language;
  setNativeLanguage: (language: Language) => void;
  setLearningLanguage: (language: Language) => void;
}

const Lessons: React.FC<LessonsProps> = ({ nativeLanguage, learningLanguage, setNativeLanguage, setLearningLanguage }) => {
    // In a real app, progress would be stored per-language-pair and fetched from a backend.
    // Here, we use local state and reset it if the learning language changes.
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    
    // Memoize the flat list of lessons to avoid re-calculating on every render
    const allLessons = useMemo(() => lessonData.flatMap(unit => unit.lessons), []);

    const handleLessonClick = (lesson: Lesson) => {
        const lessonIndex = allLessons.findIndex(l => l.id === lesson.id);
        const completedCount = completedLessons.size;
        
        // Allow clicking completed lessons or the next active lesson
        if (lessonIndex <= completedCount) {
            setActiveLesson(lesson);
        }
    };
    
    const handleCompleteLesson = (lessonId: string) => {
        setCompletedLessons(prev => new Set(prev).add(lessonId));
        setActiveLesson(null);
    };

    const handleCloseModal = () => {
        setActiveLesson(null);
    };
    
    const progressPercentage = (completedLessons.size / allLessons.length) * 100;
    
    return (
        <div className="p-4 sm:p-8 h-full flex flex-col bg-background-primary text-text-primary">
            <PageHeader
                title="Your Learning Path"
                description={`Master ${learningLanguage.name} one step at a time. Complete lessons to unlock new challenges.`}
                nativeLanguage={nativeLanguage}
                learningLanguage={learningLanguage}
                setNativeLanguage={setNativeLanguage}
                setLearningLanguage={setLearningLanguage}
            />

            {/* Progress Bar */}
            <div className="mt-6">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-text-secondary">Overall Progress</span>
                    <span className="text-sm font-bold text-accent-secondary">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-background-secondary rounded-full h-2.5 border border-background-tertiary/50">
                    <div className="bg-gradient-to-r from-cyan-500 to-yellow-400 h-2 rounded-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto mt-4">
                <LearningPath
                    units={lessonData}
                    completedLessons={completedLessons}
                    onLessonClick={handleLessonClick}
                />
            </div>

            {activeLesson && (
                <LessonModal
                    lesson={activeLesson}
                    onClose={handleCloseModal}
                    onComplete={handleCompleteLesson}
                    nativeLanguage={nativeLanguage}
                    learningLanguage={learningLanguage}
                />
            )}
        </div>
    );
};

export default Lessons;
