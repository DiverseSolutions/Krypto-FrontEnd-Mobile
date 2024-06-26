import HomePage from 'components/home/HomePage';
import { GetServerSidePropsContext } from 'next';
import React, { ReactElement } from 'react';
import client from 'src/axiosClient';


interface Props {
  data: any,
}

export default function Home(props: Props): ReactElement {
  return (
    <HomePage data={props.data} />
  )
}

const LISTING_TYPES = ['local', 'foreign'];

function getListingType(ctx: GetServerSidePropsContext) {
  const param = ctx.query.listing ? ctx.query.listing.toString() : "local";
  if (LISTING_TYPES.includes(param)) {
    return param;
  }
  return 'local';
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {

  const listingType = getListingType(ctx);
  const listingPageParam = parseInt(`${ctx.query.page}`) || 0;
  const listingPage = Math.max(listingPageParam - 1, 0);
  const listing = listingType !== 'foreign' ? await client.get(`/crypto/listing/local?page=${listingPage}&pageSize=100&convert=USD,MNT`) : await client.get(`/crypto/listing/foreign?page=${listingPage}&pageSize=20&convert=USD,MNT`);
  const news = await client.get("/news/list?page=0&pageSize=20")
  const gainers = await client.get("/crypto/gainers?page=0&pageSize=3&convert=USD,MNT");
  const trending = await client.get("/crypto/trending?page=0&pageSize=3&convert=USD,MNT");
  const recent = await client.get("/crypto/recent?page=0&pageSize=3&convert=USD,MNT");
  const marketSummary = await client.get("/crypto/market-summary?convert=MNT,USD");
  const fearAndGreed = await client.get(`/crypto/fgi`)
  const conversions = await client.get("/tools/conversions/MNT");
  const isActiveWidgets = ctx.req.cookies.isActiveWidgets === 'hide' ? 'hide' : 'show';
  return {
    props: {
      data: {
        listing: listing.data,
        news: news.data.data,
        gainers: gainers.data.data,
        trending: trending.data.data,
        recent: recent.data.data,
        marketSummary: marketSummary.data,
        listingType: listingType,
        isActiveWidgets,
        fearAndGreed: fearAndGreed.data,
        conversions: conversions.data,
      }
    },
  }
}