"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import { Pagination } from "@loamui/core";
import Link from "next/link";

const pageHref = (page: number) => `?page=${page}`;

/** Basic pagination: the sequential core from Pagination.Pages. */
export function PaginationDemo() {
  const [page, setPage] = useState(1);
  return (
    <Pagination.Root>
      <Pagination.List>
        <Pagination.Pages
          page={page}
          count={10}
          getHref={pageHref}
          onNavigate={(next, event) => {
            event.preventDefault();
            setPage(next);
          }}
        />
      </Pagination.List>
    </Pagination.Root>
  );
}

/** First/last links composed as the consumer's own Items around Pages. */
export function PaginationEdgesDemo() {
  const [page, setPage] = useState(10);
  const count = 20;
  const jump = (to: number) => (event: MouseEvent) => {
    event.preventDefault();
    setPage(to);
  };
  return (
    <Pagination.Root>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Link
            href={pageHref(1)}
            aria-label="First page"
            disabled={page === 1}
            onClick={jump(1)}
          >
            «
          </Pagination.Link>
        </Pagination.Item>
        <Pagination.Pages
          page={page}
          count={count}
          getHref={pageHref}
          onNavigate={(next, event) => {
            event.preventDefault();
            setPage(next);
          }}
        />
        <Pagination.Item>
          <Pagination.Link
            href={pageHref(count)}
            aria-label="Last page"
            disabled={page === count}
            onClick={jump(count)}
          >
            »
          </Pagination.Link>
        </Pagination.Item>
      </Pagination.List>
    </Pagination.Root>
  );
}

/** Router links through render, and the words in another language. */
export function PaginationRenderDemo() {
  const pages = [1, 2, 3];
  const current = 2;
  return (
    <Pagination.Root labels={{ navigation: "Seiten" }}>
      <Pagination.List>
        {pages.map((n) => (
          <Pagination.Item key={n}>
            <Pagination.Link
              render={<Link href={`/docs/components/pagination?page=${n}`} scroll={false} />}
              current={n === current}
              aria-label={`Seite ${n}`}
            >
              {n}
            </Pagination.Link>
          </Pagination.Item>
        ))}
        <Pagination.Ellipsis />
        <Pagination.Item>
          <Pagination.Link
            render={<Link href="/docs/components/pagination?page=12" scroll={false} />}
            aria-label="Seite 12"
          >
            12
          </Pagination.Link>
        </Pagination.Item>
      </Pagination.List>
    </Pagination.Root>
  );
}
