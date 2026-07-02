import type { Meta, StoryObj } from '@storybook/angular';

import { FilterSidebar } from '../shared/components/filter-sidebar/filter-sidebar';

const meta: Meta<FilterSidebar> = {
  title: 'Shared/Components/Filter Sidebar',
  component: FilterSidebar,
  parameters: {
    canvasWidth: '320px'
  },
  argTypes: {
    onFilterChange: { action: 'onFilterChange' },
    onReset: { action: 'onReset' }
  },
  args: {
    hasActiveFilters: true,
    activeFiltersCount: 2,
    searchTextValue: 'star wars'
  }
};

export default meta;

type Story = StoryObj<FilterSidebar>;

export const Default: Story = {};
