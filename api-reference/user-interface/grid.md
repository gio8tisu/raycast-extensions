# Grid

The `Grid` component is provided as an alternative to the [List](list.md#list) component when the defining characteristic of an item is an image.

{% hint style="info" %}
Because its API tries to stick as closely to [List](list.md#list)'s as possible, changing a view from [List](list.md#list) to [Grid](#grid) should be as simple as:

- making sure you're using at least version 1.36.0 of the `@raycast/api` package
- updating your imports from `import { List } from '@raycast/api'` to `import { Grid } from '@raycast/api'`;
- removing the `isShowingDetail` prop from the top-level `List` component, along with all [List.Item](list.md#list.item)s' `detail` prop
- renaming all [List.Item](list.md#list.item)s' h`icon` prop to `content`
- removing all [List.Item](list.md#list.item)s' `accessories`, `accessoryIcon` and `accessoryTitle props; [Grid.Item](#grid.item) does not _currently_ support accessories
- finally, replacing all usages of `List` with `Grid`,
  {% hint %}

![](../../.gitbook/assets/grid.png)

## Search Bar

The search bar allows users to interact quickly with grid items. By default, [Grid.Items](#grid.item) are displayed if the user's input can be (fuzzy) matched to the item's `title` or `keywords`.

### Custom filtering

Sometimes, you may not want to rely on Raycast's filtering, but use/implement your own. If that's the case, you can set the `Grid`'s `enableFiltering` [prop](#props) to false, and the items displayed will be independent of the search bar's text.
Note that `enableFiltering` is also implicitly set to false if an `onSearchTextChange` listener is specified. If you want to specify a change listener and _still_ take advantage of Raycast's built-in filtering, you can explicitly set `enableFiltering` to true.

```typescript
import { useEffect, useState } from "react";
import { Grid } from "@raycast/api";

const items = [
  { content: "🙈", keywords: ["see-no-evil", "monkey"] },
  { content: "🥳", keywords: ["partying", "face"] },
];

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [filteredList, filterList] = useState(items);

  useEffect(() => {
    filterList(items.filter((item) => item.keywords.some((keyword) => keyword.includes(searchText))));
  }, [searchText]);

  return (
    <Grid
      itemSize={Grid.ItemSize.Medium}
      inset={Grid.Inset.Large}
      enableFiltering={false}
      onSearchTextChange={setSearchText}
      navigationTitle="Search Emoji"
      searchBarPlaceholder="Search your favorite emoji"
    >
      {filteredList.map((item) => (
        <Grid.Item key={item.content} content={item.content} />
      ))}
    </Grid>
  );
}
```

### Programmatically updating the search bar

Other times, you may want the content of the search bar to be updated by the extension, for example, you may store a list of the user's previous searches and, on the next visit, allow them to "continue" where they left off.

To do so, you can use the `searchText` [prop](#props).

```typescript
import { useEffect, useState } from "react";
import { Action, ActionPanel, Grid } from "@raycast/api";

const items = [
  { content: "🙈", keywords: ["see-no-evil", "monkey"] },
  { content: "🥳", keywords: ["partying", "face"] },
];

export default function Command() {
  const [searchText, setSearchText] = useState("");

  return (
    <Grid
      searchText={searchText}
      onSearchTextChange={setSearchText}
      navigationTitle="Search Emoji"
      searchBarPlaceholder="Search your favorite emoji"
    >
      {items.map((item) => (
        <Grid.Item
          key={item.content}
          content={item.content}
          actions={
            <ActionPanel>
              <Action title="Select" onAction={() => setSearchText(item.content)} />
            </ActionPanel>
          }
        />
      ))}
    </Grid>
  );
}
```

### Dropdown

Some extensions may benefit from giving users a second filtering dimension. A media file management extension may allow users to view only videos or only images, an image-searching extension may allow switching ssearch engines, etc.

This is where the `searchBarAccessory` [prop](#props) is useful. Pass it a [Grid.Dropdown](#grid.dropdown) component, and it will be displayed on the right-side of the search bar. Invoke it either by using the global shortcut `⌘` `P` or by clicking on it.

## Examples

{% tabs %}
{% tab title="Grid.tsx" %}

```jsx
import { Grid } from "@raycast/api";

export default function Command() {
  return (
    <Grid itemSize={Grid.ItemSize.Small} inset={Grid.Inset.Large}>
      <Grid.Item content="🥳" />
      <Grid.Item content="🙈" />
    </Grid>
  );
}
```

{% endtab %}

{% tab title="GridWithSections.tsx" %}

```typescript
import { Grid } from "@raycast/api";

export default function Command() {
  return (
    <Grid>
      <Grid.Section title="Section 1">
        <Grid.Item content="https://placekitten.com/400/400" title="Item 1" />
      </Grid.Section>
      <Grid.Section title="Section 2" subtitle="Optional subtitle">
        <Grid.Item content="https://placekitten.com/400/400" title="Item 1" />
      </Grid.Section>
    </Grid>
  );
}
```

{% endtab %}

{% tab title="GridWithActions.tsx" %}

```typescript
import { ActionPanel, Action, Grid } from "@raycast/api";

export default function Command() {
  return (
    <Grid>
      <Grid.Item
        content="https://placekitten.com/400/400"
        title="Item 1"
        actions={
          <ActionPanel>
            <Action.CopyToClipboard content="👋" />
          </ActionPanel>
        }
      />
    </Grid>
  );
}
```

{% endtab %}

{% tab title="GridWithEmptyView.tsx" %}

```typescript
import { useEffect, useState } from "react";
import { Grid, Image } from "@raycast/api";

export default function CommandWithCustomEmptyView() {
  const [state, setState] = useState<{
    searchText: string;
    items: { content: Image.ImageLike; title: string }[];
  }>({ searchText: "", items: [] });

  useEffect(() => {
    // perform an API call that eventually populates `items`.
  }, [state.searchText]);

  return (
    <Grid onSearchTextChange={(newValue) => setState((previous) => ({ ...previous, searchText: newValue }))}>
      {state.searchText === "" && state.items.length === 0 ? (
        <Grid.EmptyView icon={{ source: "https://placekitten.com/500/500" }} title="Type something to get started" />
      ) : (
        state.items.map((item, index) => <Grid.Item key={index} content={item.content} title={item.title} />)
      )}
    </Grid>
  );
}
```

{% endtab %}

{% endtabs %}

## API Reference

### Grid

Displays [Grid.Section](#grid.section) or [Grid.Item](#grid.item).

The grid uses built-in filtering by indexing the title & keywords of its items.

#### Example

```typescript
import { Grid } from "@raycast/api";

const items = [
  { content: "🙈", keywords: ["see-no-evil", "monkey"] },
  { content: "🥳", keywords: ["partying", "face"] },
];

export default function Command() {
  return (
    <Grid
      itemSize={Grid.ItemSize.Medium}
      inset={Grid.Inset.Large}
      navigationTitle="Search Emoji"
      searchBarPlaceholder="Search your favorite emoji"
    >
      {items.map((item) => (
        <Grid.Item key={item.content} content={item.content} keywords={item.keywords} />
      ))}
    </Grid>
  );
}
```

#### Props

| Prop | Description | Type | Default |
| :--- | :--- | :--- | :--- |
| actions | A reference to an [ActionPanel](action-panel.md#actionpanel). | <code>React.ReactNode</code> | - |
| children | Grid sections or items. If [Grid.Item](grid.md#grid.item) elements are specified, a default section is automatically created. | <code>React.ReactNode</code> | - |
| enableFiltering | Toggles Raycast filtering. When `true`, Raycast will use the query in the search bar to filter grid items. When `false`, the extension needs to take care of the filtering. | <code>boolean</code> | `false` when `onSearchTextChange` is specified, `true` otherwise. |
| inset | Indicates how much space there should be between a [Grid.Item](grid.md#grid.item)s' content and its borders. The absolute value depends on the value of the `itemSize` prop. | <code>[Grid.Inset](grid.md#grid.inset)</code> | - |
| isLoading | Indicates whether a loading bar should be shown or hidden below the search bar | <code>boolean</code> | `false` |
| itemSize | The number of items that should be displayed on a single row. | <code>[Grid.ItemSize](grid.md#grid.itemsize)</code> | [Grid.ItemSize.Medium](grid.md#grid.itemsize) |
| navigationTitle | The main title for that view displayed in Raycast | <code>string</code> | Command title |
| searchBarAccessory | [Grid.Dropdown](grid.md#grid.dropdown) that will be shown in the right-hand-side of the search bar. | <code>ReactElement&lt;[Grid.Dropdown.Props](grid.md#props), string></code> | - |
| searchBarPlaceholder | Placeholder text that will be shown in the search bar. | <code>string</code> | `"Search value..."` |
| searchText | The text that will be displayed in the search bar. | <code>string</code> | - |
| selectedItemId | Selects the item with the specified id. | <code>string</code> | - |
| throttle | Defines whether the [Grid.Props.onSearchTextChange](grid.md#props) will be triggered on every keyboard press or with a delay for throttling the events. Recommended to set to `true` when using custom filtering logic with asynchronous operations (e.g. network requests). | <code>boolean</code> | `false` |
| onSearchTextChange | Callback triggered when the search bar text changes. | <code>(text: string) => void</code> | - |
| onSelectionChange | Callback triggered when the item selection in the grid changes. | <code>(id: string) => void</code> | - |

### Grid.Dropdown

A dropdown menu that will be shown in the right-hand-side of the search bar.

#### Example

```typescript
import { Grid, Image } from "@raycast/api";
import { useState } from "react";

const types = [
  { id: 1, name: "Smileys", value: "smileys" },
  { id: 2, name: "Animals & Nature", value: "animals-and-nature" },
];

const items: { [key: string]: { content: Image.ImageLike; keywords: string[] }[] } = {
  smileys: [{ content: "🥳", keywords: ["partying", "face"] }],
  "animals-and-nature": [{ content: "🙈", keywords: ["see-no-evil", "monkey"] }],
};

export default function Command() {
  const [type, setType] = useState<string>("smileys");

  return (
    <Grid
      navigationTitle="Search Beers"
      searchBarPlaceholder="Search your favorite drink"
      searchBarAccessory={
        <Grid.Dropdown tooltip="Select Emoji Category" storeValue={true} onChange={(newValue) => setType(newValue)}>
          <Grid.Dropdown.Section title="Emoji Categories">
            {types.map((type) => (
              <Grid.Dropdown.Item key={type.id} title={type.name} value={type.value} />
            ))}
          </Grid.Dropdown.Section>
        </Grid.Dropdown>
      }
    >
      {(items[type] || []).map((item) => (
        <Grid.Item content={item.content} keywords={item.keywords} />
      ))}
    </Grid>
  );
}
```

#### Props

| Prop | Description | Type | Default |
| :--- | :--- | :--- | :--- |
| tooltip<mark style="color:red;">*</mark> | Tooltip displayed when hovering the dropdown. | <code>string</code> | - |
| children | Grid sections or items. If [Grid.Dropdown.Item](grid.md#grid.dropdown.item) elements are specified, a default section is automatically created. | <code>React.ReactNode</code> | - |
| defaultValue | The default value of the dropdown. Keep in mind that `defaultValue` will be configured once per component lifecycle. This means that if a user changes the value, `defaultValue` won't be configured on re-rendering. | <code>string</code> | - |
| id | ID of the dropdown. | <code>string</code> | - |
| placeholder | Placeholder text that will be shown in the dropdown search field. | <code>string</code> | `"Search..."` |
| storeValue | Indicates whether the value of the dropdown should be persisted after selection, and restored next time the dropdown is rendered. | <code>boolean</code> | - |
| value | The currently value of the dropdown. | <code>string</code> | - |
| onChange | Callback triggered when the grid item selection changes. | <code>(newValue: string) => void</code> | - |

### Grid.Dropdown.Item

A dropdown item in a [Grid.Dropdown](#grid.dropdown)

#### Example

```typescript
import { Grid } from "@raycast/api";

export default function Command() {
  return (
    <Grid
      searchBarAccessory={
        <Grid.Dropdown tooltip="Dropdown With Items">
          <Grid.Dropdown.Item title="One" value="one" />
          <Grid.Dropdown.Item title="Two" value="two" />
          <Grid.Dropdown.Item title="Three" value="three" />
        </Grid.Dropdown>
      }
    >
      <Grid.Item content="https://placekitten.com/400/400" title="Item in the Main Grid" />
    </Grid>
  );
}
```

#### Props

| Prop | Description | Type | Default |
| :--- | :--- | :--- | :--- |
| title<mark style="color:red;">*</mark> | The title displayed for the item. | <code>string</code> | - |
| value<mark style="color:red;">*</mark> | Value of the dropdown item. Make sure to assign each unique value for each item. | <code>string</code> | - |
| icon | An optional icon displayed for the item. | <code>[Image.ImageLike](icons-and-images.md#image.imagelike)</code> | - |

### Grid.Dropdown.Section

Visually separated group of dropdown items.

Use sections to group related menu items together.

#### Example

```typescript
import { Grid } from "@raycast/api";

export default function Command() {
  return (
    <Grid
      searchBarAccessory={
        <Grid.Dropdown tooltip="Dropdown With Sections">
          <Grid.Dropdown.Section title="First Section">
            <Grid.Dropdown.Item title="One" value="one" />
          </Grid.Dropdown.Section>
          <Grid.Dropdown.Section title="Second Section">
            <Grid.Dropdown.Item title="Two" value="two" />
          </Grid.Dropdown.Section>
        </Grid.Dropdown>
      }
    >
      <Grid.Item content="https://placekitten.com/400/400" title="Item in the Main Grid" />
    </Grid>
  );
}
```

#### Props

| Prop | Description | Type | Default |
| :--- | :--- | :--- | :--- |
| children | The item elements of the section. | <code>React.ReactNode</code> | - |
| title | Title displayed above the section | <code>string</code> | - |

### Grid.EmptyView

A view to display when there aren't any items available. Use to greet users with a friendly message if the
extension requires user input before it can show any items e.g. when searching for an image, a gif etc.

Raycast provides a default `EmptyView` that will be displayed if the Grid component either has no children,
or if it has children, but none of them match the query in the search bar. This too can be overridden by passing an
empty view alongside the other `Grid.Item`s.

Note that the `EmptyView` is _never_ displayed if the `Grid`'s `isLoading` property is true and the search bar is empty.

![Grid EmptyView illustration](../../.gitbook/assets/grid-empty-view.png)

#### Example

```typescript
import { useEffect, useState } from "react";
import { Grid, Image } from "@raycast/api";

export default function CommandWithCustomEmptyView() {
  const [state, setState] = useState<{
    searchText: string;
    items: { content: Image.ImageLike; title: string }[];
  }>({ searchText: "", items: [] });

  useEffect(() => {
    // perform an API call that eventually populates `items`.
  }, [state.searchText]);

  return (
    <Grid onSearchTextChange={(newValue) => setState((previous) => ({ ...previous, searchText: newValue }))}>
      {state.searchText === "" && state.items.length === 0 ? (
        <Grid.EmptyView icon={{ source: "https://placekitten.com/500/500" }} title="Type something to get started" />
      ) : (
        state.items.map((item, index) => <Grid.Item key={index} content={item.content} title={item.title} />)
      )}
    </Grid>
  );
}
```

#### Props

| Prop | Description | Type | Default |
| :--- | :--- | :--- | :--- |
| actions | A reference to an [ActionPanel](action-panel.md#actionpanel). | <code>React.ReactNode</code> | - |
| description | An optional description for why the empty view is shown. | <code>string</code> | - |
| icon | An icon displayed in the center of the EmptyView. | <code>[Image.ImageLike](icons-and-images.md#image.imagelike)</code> | - |
| title | The main title displayed for the Empty View. | <code>string</code> | - |

### Grid.Item

A item in the [Grid](#grid).

This is one of the foundational UI components of Raycast. A grid item represents a single entity. It can be an image, an emoji, a GIF etc. You most likely want to perform actions on this item, so make it clear
to the user what this item is about.

#### Example

```typescript
import { Grid } from "@raycast/api";

export default function Command() {
  return (
    <Grid>
      <Grid.Item content="🥳" title="Partying Face" subtitle="Smiley" />
    </Grid>
  );
}
```

#### Props

| Prop | Description | Type | Default |
| :--- | :--- | :--- | :--- |
| content<mark style="color:red;">*</mark> | An image, optionally with a tooltip, representing the content of the grid item. | <code>[Image.ImageLike](icons-and-images.md#image.imagelike)</code> or <code>{ tooltip: string; value: [Image.ImageLike](icons-and-images.md#image.imagelike) }</code> | - |
| actions | A reference to an [ActionPanel](action-panel.md#actionpanel). | <code>React.ReactNode</code> | - |
| id | ID of the item. This string is passed to the `onSelectionChange` handler of the [Grid](grid.md#grid) when the item is selected. Make sure to assign each item a unique ID or a UUID will be auto generated. | <code>string</code> | - |
| keywords | An optional property used for providing additional indexable strings for search. When filtering the list in Raycast through the search bar, the keywords will be searched in addition to the title. | <code>string[]</code> | - |
| subtitle | An optional subtitle displayed next to the main title, optionally with a tooltip. | <code>string</code> or <code>{ tooltip: string; value: string }</code> | - |
| title | The main title displayed for that item, optionally with a tooltip. | <code>string</code> or <code>{ tooltip: string; value: string }</code> | - |

### Grid.Section

A group of related [Grid.Item](#grid.item).

Sections are a great way to structure your grid. For example, you can group photos taken in the same place or in the same day. This way, the user can quickly access what is most relevant.

#### Example

```typescript
import { Grid } from "@raycast/api";

export default function Command() {
  return (
    <Grid>
      <Grid.Section title="Section 1">
        <Grid.Item content="https://placekitten.com/400/400" title="Item 1" />
      </Grid.Section>
      <Grid.Section title="Section 2" subtitle="Optional subtitle">
        <Grid.Item content="https://placekitten.com/400/400" title="Item 1" />
      </Grid.Section>
    </Grid>
  );
}
```

#### Props

| Prop | Description | Type | Default |
| :--- | :--- | :--- | :--- |
| children | The [Grid.Item](grid.md#grid.item) elements of the section. | <code>React.ReactNode</code> | - |
| subtitle | An optional subtitle displayed next to the title of the section. | <code>string</code> | - |
| title | Title displayed above the section. | <code>string</code> | - |

## Types

### Grid.Inset

An enum representing the amount of space there should be between a Grid Item's content and its borders. The absolute value depends on the value of [Grid](#grid)'s `itemSize` prop.

#### Enumeration members

| Name   | Description   |
| ------ | ------------- |
| Small  | Small insets  |
| Medium | Medium insets |
| Large  | Large insets  |

### Grid.ItemSize

An enum representing the size of the Grid's child [Grid.Item](#grid.item)s.

#### Enumeration members

| Name   | Description           |
| ------ | --------------------- |
| Small  | Fits 8 items per row. |
| Medium | Fits 5 items per row. |
| Large  | Fits 3 items per row. |