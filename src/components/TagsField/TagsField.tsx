import { useState } from 'react';
import { Badge, Pill, PillsInput } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { TAGS_QUERY_KEY } from '@/helpers/tags/constants.ts';
import { commitTag } from '@/helpers/tags/commitTag.ts';
import { fetchTags } from '@/helpers/tags/fetchTags.ts';
import { filterTagSuggestions } from '@/helpers/tags/filterTagSuggestions.ts';
import styles from './TagsField.module.css';

type TagsFieldProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  enabled?: boolean;
};

const TagsField = ({ value, onChange, enabled = true }: TagsFieldProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const { data: catalog = [] } = useQuery({
    queryKey: TAGS_QUERY_KEY,
    queryFn: fetchTags,
    enabled,
  });
  const suggestions = filterTagSuggestions(catalog, query, value);

  const applyTag = (raw: string) => {
    onChange(commitTag(raw, value, catalog));
    setQuery('');
  };

  return (
    <div className={styles.root}>
      <PillsInput label={t('tags.label')}>
        <Pill.Group>
          {value.map((tag) => (
            <Pill
              key={tag}
              withRemoveButton
              onRemove={() => onChange(value.filter((item) => item !== tag))}
              removeButtonProps={{
                'aria-label': t('tags.remove', { name: tag }),
              }}
            >
              {tag}
            </Pill>
          ))}

          <PillsInput.Field
            placeholder={t('tags.placeholder')}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') {
                return;
              }

              event.preventDefault();
              applyTag(query);
            }}
          />
        </Pill.Group>
      </PillsInput>

      <div className={styles.suggestions} aria-label={t('tags.suggestions')}>
        {suggestions.map((tag) => (
          <Badge
            key={tag}
            className={styles.suggestion}
            component='button'
            type='button'
            variant='outline'
            onClick={() => applyTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagsField;
