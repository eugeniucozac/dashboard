import React from 'react';
import { render, screen, getFormTextarea, getFormHidden } from 'tests';

//app
import TaskSidebarNotes from './TaskSidebarNotes';

const initialState = {
  claims: {
    tasksProcessing: {
      selected: [
        {
          assignee: 'Bob',
          createdOn: '2021',
          targetDueDate: '2022',
          description: 'description',
          taskType: 'type1',
          taskId: '1000',
          taskRef: 'T20211000',
          caseIncidentID: 2000,
        },
      ],
    },
  },
};

describe('MODULES › TaskSidebarNotes', () => {
  describe('@render', () => {
    it('renders nothing if a task is not selected', () => {
      // arrange
      render(<TaskSidebarNotes />);

      // assert
      expect(screen.queryByTestId('task-sidebar-notes')).not.toBeInTheDocument();
    });

    it('renders the Task Sidebar Notes', () => {
      // arrange
      render(<TaskSidebarNotes />, { initialState });

      // assert
      expect(screen.getByTestId('task-sidebar-notes')).toBeInTheDocument();
    });

    it('renders the form fields', () => {
      // arrange
      const { container } = render(<TaskSidebarNotes />, { initialState });

      // assert
      expect(container.querySelector(getFormTextarea('addNotes'))).toBeInTheDocument();
      expect(container.querySelector(getFormHidden('caseIncidentID'))).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      // arrange
      render(<TaskSidebarNotes />, { initialState });

      // assert
      expect(screen.queryByText('app.save')).toBeInTheDocument();
    });

    it('renders the View Notes link', () => {
      // arrange
      render(<TaskSidebarNotes />, { initialState });

      // assert
      expect(screen.queryByText('claims.task.summary.viewNotes')).toBeInTheDocument();
    });
  });
});
