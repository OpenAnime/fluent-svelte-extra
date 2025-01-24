<script lang="ts">
    import { SplitButton, InfoBar, MenuFlyoutItem } from "$lib";
    import { Showcase, APIDocs } from "$site/lib";

    import data from "$lib/SplitButton/SplitButton.svelte?sveld&raw";
</script>

<InfoBar severity="caution">
  This component is a non-standard component that is not part of the official WinUI controls.
</InfoBar>
A SplitButton is a button that has a primary action and a secondary action. The primary action is the main button, and the secondary action is a flyout menu that appears when the user clicks the arrow next to the button.

```ts
import { SplitButton } from "fluent-svelte";
```

<Showcase columns={3} repl="0c6ca42e2c5c4868a7a8c1a1a45759eb">
    <SplitButton variant="standard">Button
    <svelte:fragment slot="flyout">
        <MenuFlyoutItem>Item 1</MenuFlyoutItem>
        <MenuFlyoutItem>Item 2</MenuFlyoutItem>
        <MenuFlyoutItem>Item 3</MenuFlyoutItem>
    </svelte:fragment>
    </SplitButton>
</Showcase>

## Usage

A split button is almost same as the `<Button>` component. So it can be a clickable action or a link. By default, the main button will be rendered as a standard HTML `<button>` element. If an `href` property is provided, the main button will be converted into an `<a>` tag.

The flyout menu can be used to display additional actions or options. The flyout menu is a `<MenuFlyout>` component that is rendered when the user clicks the arrow next to the main button. The flyout menu can contain any number of `<MenuFlyoutItem>` components.


### Styles

Split buttons come in three possible _variants_ - `standard`, `accent` and `hyperlink`. Variants can be specified using the `variant` property.

| Variant     | Preview                                               | Usage                                                                        |
| ----------- | ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| `standard`  | <SplitButton variant="standard">Standard Button</SplitButton>   | Secondary or alternative actions that are not important to the user.         |
| `accent`    | <SplitButton variant="accent">Accent Button</SplitButton>       | Actions that are important to the user, or are the primary focus a decision. |
| `hyperlink` | <SplitButton variant="hyperlink">Hyperlink Button</SplitButton> | Low-emphasis, tertiary actions that link to an external resource.            |

### Directions and Positioning

The flyout menu can be positioned in two directions - `down` and `up`. The default direction is `down`. The direction can be specified using the `direction` property.

```svelte example
<script>
	import { SplitButton, MenuFlyoutItem } from "fluent-svelte-extra";
</script>

<SplitButton direction="up">
     Button
    <svelte:fragment slot="flyout">
        <MenuFlyoutItem>Item 1</MenuFlyoutItem>
        <MenuFlyoutItem>Item 2</MenuFlyoutItem>
        <MenuFlyoutItem>Item 3</MenuFlyoutItem>
    </svelte:fragment>
</SplitButton>
```
Aligning of the flyout menu can be controlled using the `alignment` property. The alignment can be specified using the `alignment` property.

```svelte example
<script>
    import { SplitButton, MenuFlyoutItem } from "fluent-svelte-extra";
</script>
<SplitButton alignment="end">
     Button
    <svelte:fragment slot="flyout">
        <MenuFlyoutItem>Item 1</MenuFlyoutItem>
        <MenuFlyoutItem>Item 2</MenuFlyoutItem>
        <MenuFlyoutItem>Item 3</MenuFlyoutItem>
    </svelte:fragment>
</SplitButton>
```

### Disabled States

The split button has 3 properties that can be used to control the disabled state of the main button, the flyout menu, and the entire split button. The `disabled` property can be used to disable the main button, the `menuDisabled` property can be used to disable the flyout menu (The value of `disabled` is normally passed to `menuDisabled`), and the `hideChevron` property can be used to hide the button that triggers the flyout menu completely.

## Component API

<APIDocs {data} />
