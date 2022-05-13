import { appConfig } from "@config";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

type IMetaProps = {
  title: string;
  description: string;
  canonical?: string;
};

const Meta = (props: IMetaProps): React.ReactElement => {
  const router = useRouter();
  return (
    <>
      <Head>
        <meta key="charset" charSet="UTF-8" />
        <meta key="viewport" content="width=device-width,initial-scale=1" name="viewport" />
        <link key="apple" href={`${router.basePath}/apple-touch-icon.png`} rel="apple-touch-icon" />
        <link key="icon32" href={`${router.basePath}/favicon-32x32.png`} rel="icon" sizes="32x32" type="image/png" />
        <link key="icon16" href={`${router.basePath}/favicon-16x16.png`} rel="icon" sizes="16x16" type="image/png" />
        <link key="favicon" href={`${router.basePath}/favicon.ico`} rel="icon" />
      </Head>
      <NextSeo
        canonical={props.canonical}
        description={props.description}
        openGraph={{
          title: props.title,
          description: props.description,
          url: props.canonical,
          site_name: appConfig.site_name,
        }}
        title={props.title}
      />
    </>
  );
};

export { Meta };
