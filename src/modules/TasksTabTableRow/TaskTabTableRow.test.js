import React from 'react';
import { render, screen } from 'tests';
import TaskTabTableRow from './TasksTabTableRow';

const defaultProps = {
  task: {},
  isPremiumProcessing: false,
  handlers: { selectTask: () => {}, clickTask: () => {} },
  columnProps: () => {},
  taskActionItems: [],
};
const taskObj = {
  taskRef: 'Q22012014575915700',
  assigneeFullName: 'Arun Arumugam',
  description: 'vaildate slip document',
  priority: 'High',
  taskType: 'RFI',
  processRef: 'DAA00079A01',
};
const renderTaskDetails = (props) => {
  return render(<TaskTabTableRow {...defaultProps} {...props} />);
};

describe('MODULES  TaskDetails', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      renderTaskDetails();
    });
    it('renders with taskObject', () => {
      renderTaskDetails({ task: taskObj });

      expect(screen.getByText('Q22012014575915700')).toBeInTheDocument();
      expect(screen.getByText('Arun Arumugam')).toBeInTheDocument();
      expect(screen.getByText('vaildate slip document')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('RFI')).toBeInTheDocument();
      expect(screen.getByText('DAA00079A01')).toBeInTheDocument();
    });
  });
});
