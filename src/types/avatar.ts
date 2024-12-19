export enum AvatarStyle {
  ADVENTURER = 'adventurer',
  STUDENT = 'student',
  SCIENTIST = 'scientist',
  SUPERHERO = 'superhero',
  ASTRONAUT = 'astronaut',
  ARTIST = 'artist',
  ATHLETE = 'athlete',
  MUSICIAN = 'musician'
}

export interface Avatar {
  id: string;
  style: AvatarStyle;
  color: string;
  name: string;
  url: string;
}

export const AVATAR_COLORS = [
  'blue',
  'green',
  'purple',
  'red',
  'orange',
  'yellow'
] as const;

// Predefined avatars with safe, kid-friendly designs
export const AVAILABLE_AVATARS: Avatar[] = [
  {
    id: 'adventurer-blue',
    style: AvatarStyle.ADVENTURER,
    color: 'blue',
    name: 'Blue Adventurer',
    url: '/avatars/adventurer-blue.svg'
  },
  // ... more avatars
]; 