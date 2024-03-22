import React from 'react';

// app
import { render, waitFor } from 'tests';
import IndustryNews from './IndustryNews';

describe('PAGES › IndustryNews', () => {
  const initialState = {
    articles: {
      list: {
        items: [
          {
            heading_md5: '1fba4db9a30d149ecb7ce75991c1477c',
            excerpt_md5: 'e7d9658d02f881b31462d9c45ba9f001',
            id: 362548,
            organisation: { id: 52, name: 'Topic Article', slug: 'topic-article-3493', default: true },
            heading: 'Elon Musk touts low cost to insure SpaceX rockets as edge over competitors - CNBC',
            excerpt:
              'SpaceX is launching more often than any other country or company and CEO Elon Musk touted low insurance costs as proof of reliability...',
            topics: [
              { id: 9, slug: 'aviation', name: 'Aerospace', category: 1 },
              { id: 90, slug: 'ratings', name: 'Rates', category: 2 },
            ],
            slug: 'elon-musk-touts-low-cost-to-insure-spacex-rockets-as-edge-over-competitors-cnbc',
            external_url: 'https://www.cnbc.com/2020/04/16/elon-musk-spacex-falcon-9-rocket-over-a-million-dollars-less-to-insure.html',
            paywalled: false,
            registration_required: false,
            date: '2020-04-17T08:05:10+0000',
            featured_image_url: 'https://mvvsp1.5gcdn.net/bb1ea3058ced4d9db37437d733d92cf7/resize_512x512,crop_512x512,auto',
            organisation_logo_url:
              'https://mvvsp1.5gcdn.net/89ee5fa66ebb427a8eb02d02b74149db/resize_512x512,crop_512x512,fill_512x512,auto',
            organisation_cover_url: 'https://mvvsp1.5gcdn.net/ef6797bc02d543f28a7c503dcd76fcad/resize_512x512,crop_512x512,auto',
            article_type: 'article',
            web_url:
              'https://widget.slipcase.com/view/elon-musk-touts-low-cost-to-insure-spacex-rockets-as-edge-over-competitors-cnbc?api_view=1&widget=5c0192578add277855ed33deb28d2c27b8e074b5&id=362548',
            guid: 362548,
          },
        ],
      },
    },
  };
  describe('@render', () => {
    it('renders the page title', async () => {
      // arrange
      render(<IndustryNews />);

      // assert
      await waitFor(() => expect(document.title).toContain('industryNews.title'));
    });

    it('renders correct icon and title', () => {
      // arrange
      const { getByText, getByTestId } = render(<IndustryNews />);

      // assert
      expect(getByText('industryNews.title')).toBeInTheDocument();
      expect(getByTestId('page-header-industry-news-icon')).toBeInTheDocument();
    });
    it('renders articles', () => {
      // arrange
      const { getByText } = render(<IndustryNews />, { initialState });

      // assert
      expect(getByText('format.date(2020-04-17T08:05:10+0000)')).toBeInTheDocument();
      expect(getByText('Elon Musk touts low cost to insure SpaceX rockets as edge over competitors - CNBC')).toBeInTheDocument();
      expect(
        getByText(
          'SpaceX is launching more often than any other country or company and CEO Elon Musk touted low insurance costs as proof of reliability...'
        )
      ).toBeInTheDocument();
    });
  });
});
