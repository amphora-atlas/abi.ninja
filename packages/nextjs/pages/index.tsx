import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { MiniFooter } from "~~/components/MiniFooter";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { useGlobalState } from "~~/services/store/store";

const Home: NextPage = () => {
  const router = useRouter();

  const { setContractAbi, setImplementationAddress } = useGlobalState(state => ({
    setContractAbi: state.setContractAbi,
    setImplementationAddress: state.setImplementationAddress,
  }));

  useEffect(() => {
    if (router.pathname === "/") {
      setContractAbi([]);
      setImplementationAddress("");
    }
  }, [router.pathname, setContractAbi, setImplementationAddress]);

  return (
    <>
      <MetaHeader />
      <div className="flex flex-grow items-center justify-center bg-base-100">
        <div className="flex h-screen bg-base-200 relative overflow-x-hidden w-full flex-col items-center justify-center rounded-2xl pb-4 lg:h-[650px] lg:w-[450px] lg:justify-between lg:shadow-xl">
          <div className="flex-grow flex flex-col items-center justify-center lg:w-full">
            <div className="my-16 flex flex-col items-center justify-center">
              <Image src="/logo_inv.svg" alt="logo" width={119} height={87} className="mb-4" />
              <h2 className="mb-0 text-5xl font-bold">ABI Ninja</h2>
              <p className="text-center mb-8">Interact with smart contracts on any EVM chain</p>
              <p className="text-center text-sm mb-8 px-4">
                Navigate directly to contracts using URLs like: <br />
                <code className="bg-neutral px-2 py-1 rounded text-xs">
                  /{"{address}"}/{"{chainId}"}
                </code>
              </p>
              <div className="flex flex-col text-sm w-4/5 mb-10">
                <div className="mb-2 text-center text-base">Quick access</div>
                <div className="flex justify-center w-full rounded-xl">
                  <Link
                    href="/0x6B175474E89094C44Da98b954EedeAC495271d0F/1"
                    passHref
                    className="link w-1/3 text-center text-base-content no-underline"
                  >
                    DAI
                  </Link>
                  <Link
                    href="/0xde30da39c46104798bb5aa3fe8b9e0e1f348163f/1"
                    passHref
                    className="link w-1/3 text-center text-base-content no-underline"
                  >
                    Gitcoin
                  </Link>
                  <Link
                    href="/0x00000000006c3852cbef3e08e8df289169ede581/1"
                    passHref
                    className="link w-1/3 text-center text-base-content no-underline"
                  >
                    Opensea
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <SwitchTheme className="absolute top-5 right-5" />
          <MiniFooter />
        </div>
      </div>
    </>
  );
};

export default Home;
