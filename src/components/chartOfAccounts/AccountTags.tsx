
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { AccountTag } from '@/types/chartOfAccounts';

interface AccountTagsProps {
  tags: AccountTag[];
  onRemoveTag?: (tag: AccountTag) => void;
  readonly?: boolean;
}

export const AccountTags = ({ tags, onRemoveTag, readonly = false }: AccountTagsProps) => {
  const getTagColor = (tag: AccountTag) => {
    switch (tag) {
      case 'operacional': return 'bg-blue-100 text-blue-800';
      case 'estrategica': return 'bg-purple-100 text-purple-800';
      case 'regulatoria': return 'bg-red-100 text-red-800';
      case 'fiscal': return 'bg-green-100 text-green-800';
      case 'gerencial': return 'bg-yellow-100 text-yellow-800';
      case 'temporaria': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTagLabel = (tag: AccountTag) => {
    switch (tag) {
      case 'operacional': return 'Operacional';
      case 'estrategica': return 'Estratégica';
      case 'regulatoria': return 'Regulatória';
      case 'fiscal': return 'Fiscal';
      case 'gerencial': return 'Gerencial';
      case 'temporaria': return 'Temporária';
      default: return tag;
    }
  };

  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className={`${getTagColor(tag)} text-xs`}
        >
          {getTagLabel(tag)}
          {!readonly && onRemoveTag && (
            <Button
              variant="ghost"
              size="sm"
              className="h-3 w-3 p-0 ml-1 hover:bg-transparent"
              onClick={() => onRemoveTag(tag)}
            >
              <X className="h-2 w-2" />
            </Button>
          )}
        </Badge>
      ))}
    </div>
  );
};
