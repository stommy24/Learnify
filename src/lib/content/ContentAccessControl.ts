import { AgeGroup, DifficultyLevel } from '@/types/rbac';

interface ContentMetadata {
  ageGroup: AgeGroup[];
  difficulty: DifficultyLevel;
  subjects: string[];
  keywords: string[];
  safeSearch: boolean;
}

export class ContentAccessControl {
  private static instance: ContentAccessControl;

  private constructor() {}

  static getInstance(): ContentAccessControl {
    if (!ContentAccessControl.instance) {
      ContentAccessControl.instance = new ContentAccessControl();
    }
    return ContentAccessControl.instance;
  }

  public canAccessContent(
    userAgeGroup: AgeGroup,
    userDifficultyLevel: DifficultyLevel,
    content: ContentMetadata
  ): boolean {
    // Check age appropriateness
    if (!this.isAgeAppropriate(userAgeGroup, content.ageGroup)) {
      return false;
    }

    // Check difficulty level
    if (!this.isDifficultyAppropriate(userDifficultyLevel, content.difficulty)) {
      return false;
    }

    return true;
  }

  private isAgeAppropriate(userAge: AgeGroup, contentAges: AgeGroup[]): boolean {
    const ageHierarchy: AgeGroup[] = ['under13', '13-16', '16-18', 'adult'];
    const userAgeIndex = ageHierarchy.indexOf(userAge);
    
    return contentAges.some(contentAge => {
      const contentAgeIndex = ageHierarchy.indexOf(contentAge);
      return contentAgeIndex <= userAgeIndex;
    });
  }

  private isDifficultyAppropriate(
    userLevel: DifficultyLevel,
    contentLevel: DifficultyLevel
  ): boolean {
    // Allow access to content up to one level higher than user's level
    return contentLevel <= userLevel + 1;
  }

  public filterContent<T extends { metadata: ContentMetadata }>(
    content: T[],
    userAgeGroup: AgeGroup,
    userDifficultyLevel: DifficultyLevel
  ): T[] {
    return content.filter(item =>
      this.canAccessContent(userAgeGroup, userDifficultyLevel, item.metadata)
    );
  }

  public async validateContent(
    content: ContentMetadata
  ): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];

    // Validate age groups
    if (!content.ageGroup || content.ageGroup.length === 0) {
      issues.push('Content must specify target age groups');
    }

    // Validate difficulty level
    if (!content.difficulty || content.difficulty < 1 || content.difficulty > 5) {
      issues.push('Content must have a valid difficulty level (1-5)');
    }

    // Validate subjects
    if (!content.subjects || content.subjects.length === 0) {
      issues.push('Content must be associated with at least one subject');
    }

    // Validate safe search
    if (content.safeSearch === undefined) {
      issues.push('Content must have safe search validation');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

export const useContentAccess = () => {
  const contentControl = ContentAccessControl.getInstance();
  return {
    canAccessContent: contentControl.canAccessContent.bind(contentControl),
    filterContent: contentControl.filterContent.bind(contentControl),
    validateContent: contentControl.validateContent.bind(contentControl)
  };
}; 