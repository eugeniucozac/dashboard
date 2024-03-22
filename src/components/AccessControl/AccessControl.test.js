import React from 'react';
import { render, screen } from 'tests';
import AccessControl from './AccessControl';

describe('COMPONENTS › Accordion', () => {
  describe('general', () => {
    describe('denies access (renders nothing)', () => {
      it('if no props are defined', () => {
        // arrange
        const initialState = {
          user: {
            privilege: {},
          },
        };
        render(<AccessControl>foo</AccessControl>);

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });

      it("if there's no children content to render", () => {
        // arrange
        const initialState = {
          user: {
            privilege: {
              foo: ['read'],
            },
          },
        };
        render(<AccessControl feature="foo" permissions="read" />, { initialState });

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });
    });
  });

  describe('feature', () => {
    describe('denies access (renders nothing)', () => {
      it('if feature prop is missing', () => {
        // arrange
        const initialState = {
          user: {
            privilege: {},
          },
        };
        render(<AccessControl permissions="read">foo</AccessControl>, { initialState });

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });

      it('if permissions prop is missing', () => {
        // arrange
        const initialState = {
          user: {
            privilege: {},
          },
        };
        render(<AccessControl feature="foo">foo</AccessControl>, { initialState });

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });

      it('if route prop is defined in addition to feature and permissions', () => {
        // arrange
        const initialState = {
          user: {
            privilege: {},
          },
        };
        render(
          <AccessControl feature="foo" route="bar" permissions="read">
            foo
          </AccessControl>,
          { initialState }
        );

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });

      it('if user privilege state object is missing', () => {
        // arrange
        render(
          <AccessControl feature="foo" permissions="read">
            foo
          </AccessControl>
        );

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });

      it('if user privilege state object is empty', () => {
        // arrange
        const initialState = {
          user: {
            privilege: {},
          },
        };
        render(
          <AccessControl feature="foo" permissions="read">
            foo
          </AccessControl>,
          { initialState }
        );

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });

      it('if the requested feature does not exist', () => {
        // arrange
        const initialState = {
          user: {
            privilege: {
              foo: ['read'],
              bar: ['update'],
            },
          },
        };
        render(
          <AccessControl feature="dummy" permissions="read">
            foo
          </AccessControl>,
          { initialState }
        );

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });

      it('if the requested feature exists but the requested permissions is not allowed', () => {
        // arrange
        const initialState = {
          user: {
            privilege: {
              foo: ['read'],
              bar: ['update'],
            },
          },
        };
        render(
          <AccessControl feature="foo" permissions="create">
            foo
          </AccessControl>,
          { initialState }
        );

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });

      it('if access privilege has one permission allowed but multiple permissions requested', () => {
        // arrange
        const initialState = {
          user: {
            privilege: {
              foo: ['create'],
            },
          },
        };
        render(
          <AccessControl feature="foo" permissions={['create', 'read']}>
            foo
          </AccessControl>,
          { initialState }
        );

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });
    });

    describe('allows access (renders children content)', () => {
      it('if access privilege has one permission allowed and one permission requested', () => {
        // arrange
        const initialState = {
          user: {
            privilege: {
              foo: ['read'],
            },
          },
        };
        render(
          <AccessControl feature="foo" permissions="read">
            foo
          </AccessControl>,
          { initialState }
        );

        // assert
        expect(screen.getByText('foo')).toBeInTheDocument();
      });

      it('if access privilege has multiple permissions allowed and one permission requested', () => {
        // arrange
        const initialState = {
          user: {
            privilege: {
              foo: ['create', 'read', 'update', 'delete'],
            },
          },
        };
        render(
          <AccessControl feature="foo" permissions="read">
            foo
          </AccessControl>,
          { initialState }
        );

        // assert
        expect(screen.getByText('foo')).toBeInTheDocument();
      });

      it('if access privilege has multiple permissions allowed and multiple permissions requested', () => {
        // arrange
        const initialState = {
          user: {
            privilege: {
              foo: ['create', 'read', 'update', 'delete'],
            },
          },
        };
        render(
          <AccessControl feature="foo" permissions={['read', 'update', 'delete']}>
            foo
          </AccessControl>,
          { initialState }
        );

        // assert
        expect(screen.getByText('foo')).toBeInTheDocument();
      });

      it('if the permissions props is passed as a string', () => {
        // arrange
        const initialState = {
          user: {
            privilege: {
              foo: ['create', 'read', 'update', 'delete'],
            },
          },
        };
        render(
          <AccessControl feature="foo" permissions="create">
            foo
          </AccessControl>,
          { initialState }
        );

        // assert
        expect(screen.getByText('foo')).toBeInTheDocument();
      });

      it('if the permissions props is passed as an array', () => {
        // arrange
        const initialState = {
          user: {
            privilege: {
              foo: ['create', 'read', 'update', 'delete'],
            },
          },
        };
        render(
          <AccessControl feature="foo" permissions={['delete']}>
            foo
          </AccessControl>,
          { initialState }
        );

        // assert
        expect(screen.getByText('foo')).toBeInTheDocument();
      });
    });
  });

  describe('route', () => {
    describe('denies access (renders nothing)', () => {
      it('if route prop is missing', () => {
        // arrange
        const initialState = {
          user: {
            routes: ['foo'],
          },
        };
        render(<AccessControl>foo</AccessControl>, { initialState });

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });

      it('if route prop is empty', () => {
        // arrange
        const initialState = {
          user: {
            routes: ['foo'],
          },
        };
        render(<AccessControl route="">foo</AccessControl>, { initialState });

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });

      it('if route prop is not a string', () => {
        // arrange
        const initialState = {
          user: {
            routes: ['foo'],
          },
        };
        render(<AccessControl route={['foo']}>foo</AccessControl>, { initialState });

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });

      it('if user routes state array is missing', () => {
        // arrange
        const initialState = { user: {} };
        render(<AccessControl route="foo">foo</AccessControl>, { initialState });

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });

      it('if user routes state array is empty', () => {
        // arrange
        const initialState = {
          user: {
            routes: [],
          },
        };
        render(<AccessControl route="foo">foo</AccessControl>, { initialState });

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });

      it('if feature prop is defined in addition to route prop', () => {
        // arrange
        const initialState = {
          user: {
            routes: ['foo'],
          },
        };
        render(
          <AccessControl route="foo" feature="bar">
            foo
          </AccessControl>,
          { initialState }
        );

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });

      it('if permissions prop is defined in addition to route prop', () => {
        // arrange
        const initialState = {
          user: {
            routes: ['foo'],
          },
        };
        render(
          <AccessControl route="foo" permissions="read">
            foo
          </AccessControl>,
          { initialState }
        );

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });

      it('if the requested routes is not allowed', () => {
        // arrange
        const initialState = {
          user: {
            routes: ['foo', 'bar'],
          },
        };
        render(<AccessControl route="dummy">foo</AccessControl>, { initialState });

        // assert
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
      });
    });

    describe('allows access (renders children route)', () => {
      it('if route is allowed', () => {
        // arrange
        const initialState = {
          user: {
            routes: ['foo', 'bar'],
          },
        };
        render(<AccessControl route="foo">foo</AccessControl>, { initialState });

        // assert
        expect(screen.getByText('foo')).toBeInTheDocument();
      });
    });
  });
});
