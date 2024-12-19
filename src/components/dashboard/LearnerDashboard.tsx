import React, { useState } from 'react';
import { useRBAC } from '@/lib/rbac/RBACProvider';
import { useContentRecommender } from '@/lib/recommendations/ContentRecommender';
import { Card } from '../common/Card';
import { TabGroup } from '../common/TabGroup';
import { ProgressChart } from '../charts/ProgressChart';
import { ContentList } from '../content/ContentList';
import { Content } from '@/types/content';
import { UserIdentifier } from '@/types/users';

// Define base user identifier interface
interface BaseIdentifier {
  id: string;
  name: string;
  accountType: 'teacher' | 'learner' | 'guardian';
}

// Extend base interface for specific user types
interface TeacherIdentifier extends BaseIdentifier {
  accountType: 'teacher';
  subjects: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  schoolAffiliation: string;
}

interface LearnerIdentifier extends BaseIdentifier {
  accountType: 'learner';
  grade: string;
}

interface GuardianIdentifier extends BaseIdentifier {
  accountType: 'guardian';
  children: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

// Define content list props
interface ContentListProps {
  items: Array<{
    id: string;
    title: string;
    description: string;
    // ... other content item properties
  }>;
  loading?: boolean;
}

export function LearnerDashboard({ user }: { user: UserIdentifier }) {
  const { identifier } = useRBAC();
  const { getRecommendations } = useContentRecommender();
  const [recentContent, setRecentContent] = useState<Content[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Current Progress">
              <div className="text-3xl font-bold">75%</div>
            </Card>
            <Card title="Topics Mastered">
              <div className="text-3xl font-bold">12</div>
            </Card>
            <Card title="Learning Streak">
              <div className="text-3xl font-bold">5 days</div>
            </Card>
          </div>
          
          <Card title="Progress Over Time">
            <ProgressChart data={[]} /> {/* Add actual progress data */}
          </Card>
        </div>
      )
    },
    {
      id: 'learning',
      label: 'Continue Learning',
      content: (
        <div className="space-y-6">
          <Card title="Recommended for You">
            <ContentList
              items={recommendedContent}
              loading={isLoading}
            />
          </Card>
          
          <Card title="In Progress">
            <ContentList
              items={recentContent}
              loading={isLoading}
            />
          </Card>
        </div>
      )
    },
    {
      id: 'achievements',
      label: 'Achievements',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add achievement cards */}
        </div>
      )
    }
  ];

  return (
    <div className="grid gap-6">
      <section>
        <h2>Recent Content</h2>
        <ContentList 
          items={recentContent}
          loading={isLoading}
        />
      </section>

      <section>
        <h2>Recommended for You</h2>
        <ContentList 
          items={recommendedContent}
          loading={isLoading}
        />
      </section>

      {user.accountType === 'learner' && (
        // Learner specific content
        <div>
          {/* Additional learner-specific UI */}
        </div>
      )}
    </div>
  );
} 