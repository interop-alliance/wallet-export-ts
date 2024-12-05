export const outbox = [
  {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: 'outbox.json',
    type: 'OrderedCollection',
    totalItems: 3,
    orderedItems: [
      {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: 'https://example.com/users/alice/statuses/109407353983685867/activity',
        type: 'Announce',
        actor: 'https://example.com/users/alice',
        published: '2022-11-26T00:48:56Z',
        to: ['https://www.w3.org/ns/activitystreams#Public'],
        cc: [
          'https://mastodon.social/users/bobwyman',
          'https://example.com/users/alice/followers'
        ],
        object:
          'https://mastodon.social/users/bobwyman/statuses/109399822260648081'
      },
      {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: 'https://example.com/users/alice/statuses/109412389200730237/activity',
        type: 'Announce',
        actor: 'https://example.com/users/alice',
        published: '2022-11-26T22:09:27Z',
        to: ['https://www.w3.org/ns/activitystreams#Public'],
        cc: [
          'https://omfg.town/users/dansinker',
          'https://example.com/users/alice/followers'
        ],
        object: 'https://omfg.town/users/dansinker/statuses/109411849664571485'
      },
      {
        id: 'https://example.com/users/alice/statuses/109419229622587183/activity',
        type: 'Create',
        actor: 'https://example.com/users/alice',
        published: '2022-11-28T03:09:04Z',
        to: ['https://www.w3.org/ns/activitystreams#Public'],
        cc: [
          'https://example.com/users/alice/followers',
          'https://mindly.social/users/djdellamorte'
        ],
        object: {
          id: 'https://example.com/users/alice/statuses/109419229622587183',
          type: 'Note',
          summary: null,
          inReplyTo:
            'https://mindly.social/users/djdellamorte/statuses/109417853187485668',
          published: '2022-11-28T03:09:04Z',
          url: 'https://example.com/@alice/109419229622587183',
          attributedTo: 'https://example.com/users/alice',
          to: ['https://www.w3.org/ns/activitystreams#Public'],
          cc: [
            'https://example.com/users/alice/followers',
            'https://mindly.social/users/djdellamorte'
          ],
          sensitive: false,
          atomUri:
            'https://example.com/users/alice/statuses/109419229622587183',
          inReplyToAtomUri:
            'https://mindly.social/users/djdellamorte/statuses/109417853187485668',
          conversation:
            'tag:mindly.social,2022-11-27:objectId=5397243:objectType=Conversation',
          content:
            '<p><span class="h-card"><a href="https://mindly.social/@djdellamorte" class="u-url mention">@<span>djdellamorte</span></a></span> I see them used a lot as a teleprompter, when recording videos or podcasts.</p>',
          contentMap: {
            en: '<p><span class="h-card"><a href="https://mindly.social/@djdellamorte" class="u-url mention">@<span>djdellamorte</span></a></span> I see them used a lot as a teleprompter, when recording videos or podcasts.</p>'
          },
          attachment: [],
          tag: [
            {
              type: 'Mention',
              href: 'https://mindly.social/users/djdellamorte',
              name: '@djdellamorte@mindly.social'
            }
          ],
          replies: {
            id: 'https://example.com/users/alice/statuses/109419229622587183/replies',
            type: 'Collection',
            first: {
              type: 'CollectionPage',
              next: 'https://example.com/users/alice/statuses/109419229622587183/replies?only_other_accounts=true&page=true',
              partOf:
                'https://example.com/users/alice/statuses/109419229622587183/replies',
              items: []
            }
          }
        },
        signature: {
          type: 'RsaSignature2017',
          creator: 'https://example.com/users/alice#main-key',
          created: '2023-05-09T02:46:04Z',
          signatureValue:
            'eLb+AzyjDei4G6MkRlw/CCxObyWS+dMAo+8NlvPATt9xjud+KLSq8oc9vaSEYk+3uovw5XfdVdlFF+FAgq1kDGJJfGq4xOVpm8JzLtqbMsEfB6BFAEGyCvO8iQD9pFhNRrzZOKoznKrnFjLnItbv9eyNefZISEqHRuO6wHcfTvuPGrChwNPg9FKUQaSvB1wx9KShgypzcQbZA5BMXhJSQGcIIZXGa2GenXi6brGlIorFxb5nNtJnGpn2kxKHQpcfFsA4L2q/sIzVYTPO+O/KyLtjWIaITHm0R1SeToGK47M/yOR3a/7oh/r/5ncKornLnTwKW+EBn41E8cxMnHIZsw=='
        }
      }
    ]
  }
]
