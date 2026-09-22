---
title: Search
description: The page's search, as a landmark.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Search

The site's or page's search: a search landmark around a native form, with a search box and a submit.

## Import

```tsx
import { Search, Field } from "@loamui/core";
```

## Usage

### In a site header

The header recipe: the search sits beside the brand, in the row a site's actions share; The label names the box for a screen reader without showing on screen; the button submits, and so does Enter in the box. Without an action the form submits to the current page as a GET with the query under q.

```tsx
<header>
  <strong>Loam</strong>
  <Search.Root>
    <Search.Label>Search this site</Search.Label>
    <Search.Input />
    <Search.Button />
  </Search.Root>
</header>
```

### Icon only

An svg child is detected by Button as an icon, and the aria-label names the button and makes it square; the name is still read. Keep the word for the landmark and the box; the icon is only what is seen, so it is aria-hidden.

```tsx
<Search.Root>
  <Search.Label>Search this site</Search.Label>
  <Search.Input />
  <Search.Button aria-label="Search">
    <IconSearch aria-hidden />
  </Search.Button>
</Search.Root>
```

### In a Field

A Field around the box names it visibly and adds a hint; the box wires itself to the Field, so Search.Label is not needed. The landmark takes its own name because a second search on the page must be told apart from the site's.

```tsx
<Search.Root aria-label="Search orders">
  <Field.Root>
    <Field.Label>Order number</Field.Label>
    <Field.Description>The reference on your confirmation email.</Field.Description>
    <Search.Input name="order" />
  </Field.Root>
  <Search.Button>Find order</Search.Button>
</Search.Root>
```

## When to use it

- For the search of a site or a section of it: a query the user types, submits, and gets a page of results for. The landmark lets a screen reader user jump straight to it from anywhere on the page.
- For a search of one kind of thing that has its own page of results (orders, people, documents), named for what it searches so it is told apart from the site's search.

## When not to

- For filtering a table or a list in place as the user types. That is not a search landmark and has no submit; use a plain Input in a Field, labelled for what it filters.
- For a command menu or a jump-to box that opens results as a list to pick from. That is its own pattern with its own keyboard contract, not a form that submits.

## How it works

### The landmark is the element

Search.Root renders a native <search> element, which is the search landmark by itself, around a native form. A screen reader lists it among the page's landmarks, Enter in the box submits, and the query travels as a GET to the action under the name q, so a results page has a URL that can be shared.

### Every search has a name, and no two share one

The box is named by Search.Label, which is read but not shown, or by the Field around it, which is shown. The landmark is named "Search" by default. A page with two searches gives each its own aria-label ("Site search", "Search orders"), because a landmark list that says "search, search" tells the user nothing.

### type="search" keeps the platform's clear affordance

The box is the library's Input with type set to search, so the browser draws its own clear control once there is text, the on-screen keyboard shows a Search key, and the browser remembers past queries. The native search input retains those familiar browser behaviours.

## Accessibility

- The <search> element is the search landmark: it is announced as one and reachable by landmark navigation without a role attribute. Its accessible name comes from aria-label, so it is read in a landmark list.
- The box always has a real <label>: Search.Label ties itself to the box by id, hidden with the same recipe as the library's other read-only text, or a Field.Label names it visibly. A placeholder is never the name.
- The submit is a native button with a name: text by default, or an aria-label when it shows only an icon. The icon itself is aria-hidden so the name is read once.

## Parts

### Search.Root

The <search> landmark around a native <form>. className and style dress the landmark; every other native <form> prop, and the ref, go to the form.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label` | `string` | `"Search"` | The landmark's name. Give a second search on the page its own so the two are told apart. |
| `action` | `string` | — | Where the query is sent; the current page when omitted. |
| `method` | `"get" \| "post"` | `"get"` | GET puts the query in the URL, so a results page can be shared. |
| `onSubmit` | `(event: FormEvent) => void` | — | Runs on Enter in the box and on the button. Call preventDefault to search without navigating. |

### Search.Label

The box's name, read but not seen. Native <label> props are forwarded. Not needed when a Field around the box names it.

### Search.Input

The library's Input as a search box: type="search", inputMode and enterKeyHint set to search. Inside a Field it takes the Field's label, description and error.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | `"q"` | The query's key in the submitted URL. |
| `...others` | `InputProps` | — | All Input props are forwarded, except type. |

### Search.Button

The submit: the library's Button with type="submit". Children default to "Search"; an icon with an aria-label makes it icon-only.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...others` | `ButtonProps` | — | All Button props are forwarded. |

