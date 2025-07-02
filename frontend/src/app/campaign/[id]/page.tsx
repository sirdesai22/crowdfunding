"use client";
import { ethers } from "ethers";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Funding from "@/Funding.json";

type Props = {};

const page = (props: Props) => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [contractInstance, setContractInstance] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      setProvider(provider);
      const signer = await provider.getSigner();
      setSigner(signer);
      const contractInstance = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        Funding.abi,
        signer
      );
      setContractInstance(contractInstance);
      const campaign = await contractInstance.getCampaignDetails(id as string);
      setCampaign(campaign);
    };
    fetchCampaign();
  }, []);

  if (!campaign) return <div>Loading...</div>;
  return (
    <div className="flex flex-col items-center min-h-screen">
    <div className="min-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center gap-2">
        <span className="inline-block w-2 h-8 bg-blue-500 rounded mr-2"></span>
        Campaign #{id}
      </h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{campaign.name}</h2>
        <p className="text-gray-600 mb-4">{campaign.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col items-start">
          <span className="text-gray-500 text-sm">Goal</span>
          <span className="text-lg font-medium text-green-700">{campaign.amount} / {campaign.goal} ETH</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-gray-500 text-sm">Deadline</span>
          <span className="text-lg font-medium text-red-700">
            {new Date(Number(campaign.deadline) * 1000).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-gray-500 text-sm">Creator</span>
        <span className="text-md font-mono text-gray-700 break-all">{campaign.creator}</span>
        </div>
      </div>
    <div className="flex flex-col gap4">
        {/* funder list */}
        <div className="flex flex-col gap-2">
            <p className="text-gray-100 rounded-md text-3xl mt-8 font-semibold">Funders</p>
            <div className="flex flex-col gap-2">
                {campaign.funders.map((funder: any, index: number) => (
                    <div className="flex flex-row gap-2 items-center min-w-2xl bg-gray-100 p-2 rounded-md justify-between" key={index}>
                        <span className="text-gray-500 text-sm">Funder {index + 1}</span>
                        <span className="text-md font-mono text-gray-700 break-all">{funder.toString()}</span>
                    </div>
                ))}
            </div>
        </div>
        </div>
    </div>
  );
};

export default page;
