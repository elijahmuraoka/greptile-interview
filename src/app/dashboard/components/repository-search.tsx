'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Repository } from '@/actions/githubActions';

interface RepositorySearchProps {
  repositories: Repository[];
  selectedRepository: Repository | null;
  setSelectedRepository: (repository: Repository | null) => void;
}

export default function RepositorySearch({
  repositories,
  selectedRepository,
  setSelectedRepository,
}: RepositorySearchProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedRepository
            ? repositories.find((repository) => repository.id === selectedRepository.id)?.name
            : 'Select repository...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search repository..." />
          <CommandList>
            <CommandEmpty>No repository found.</CommandEmpty>
            <CommandGroup>
              {repositories.map((repository) => (
                <CommandItem
                  key={repository.id}
                  value={repository.name}
                  onSelect={(currentSelectedRepository) => {
                    setSelectedRepository(
                      repositories.find((repo) => repo.name === currentSelectedRepository) ||
                        selectedRepository
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedRepository?.id === repository.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {repository.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
