'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Avatar, AVAILABLE_AVATARS, AVATAR_COLORS, AvatarStyle } from '@/types/avatar';

interface AvatarSelectorProps {
  currentAvatarId?: string;
  onSelect: (avatarId: string) => void;
}

export default function AvatarSelector({ currentAvatarId, onSelect }: AvatarSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>(
    AVAILABLE_AVATARS.find(a => a.id === currentAvatarId)?.style || AvatarStyle.STUDENT
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    AVAILABLE_AVATARS.find(a => a.id === currentAvatarId)?.color || 'blue'
  );

  const filteredAvatars = AVAILABLE_AVATARS.filter(
    avatar => avatar.style === selectedStyle
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {Object.values(AvatarStyle).map((style) => (
          <button
            key={style}
            onClick={() => setSelectedStyle(style)}
            className={`px-4 py-2 rounded-lg ${
              selectedStyle === style
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {style}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {AVATAR_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-8 h-8 rounded-full border-2 ${
              selectedColor === color ? 'border-primary' : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {filteredAvatars
          .filter(avatar => avatar.color === selectedColor)
          .map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => onSelect(avatar.id)}
              className={`p-2 rounded-lg ${
                currentAvatarId === avatar.id
                  ? 'ring-2 ring-primary'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Image
                src={avatar.url}
                alt={avatar.name}
                width={100}
                height={100}
                className="w-full h-auto"
              />
            </button>
          ))}
      </div>
    </div>
  );
} 