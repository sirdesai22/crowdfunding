"use client";

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Funding from "@/Funding.json";
import { useRouter } from "next/navigation";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

export default function Home() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([
    {
      name: "Campaign 1",
      description: "This is a campaign description",
      amount: 0,
      goal: 100,
      deadline: 1719859200,
      creator: "0x1234567890123456789012345678901234567890",
      isActive: true,
      id: 1,
    },
    {
      name: "Campaign 2",
      description: "This is a campaign description",
      amount: 0,
      goal: 100,
      deadline: 1719859200,
      creator: "0x1234567890123456789012345678901234567890",
      isActive: true,
      id: 2,
    },
    {
      name: "Campaign 3",
      description: "This is a campaign description",
      amount: 0,
      goal: 100,
      deadline: 1719859200,
      creator: "0x1234567890123456789012345678901234567890",
      isActive: true,
      id: 3,
    },
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [contract, setContract] = useState<any>();

  const connectWallet = async () => {
    try {
      const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const getContract = async () => {
    try {
      setError("");
      let provider;
      let contractInstance;

      if ((window as any).ethereum && isConnected) {
        // Use wallet provider if connected
        provider = new ethers.BrowserProvider((window as any).ethereum);
        setProvider(provider);
        const signer = await provider.getSigner();
        setSigner(signer);
        contractInstance = new ethers.Contract(CONTRACT_ADDRESS, Funding.abi, signer);
        setContract(contractInstance);
      } else {
        // Use read-only provider (e.g., local Hardhat node or public RPC)
        provider = new ethers.JsonRpcProvider("http://localhost:8545"); // or your testnet/mainnet RPC URL
        setProvider(provider);
        contractInstance = new ethers.Contract(CONTRACT_ADDRESS, Funding.abi, provider);
        setContract(contractInstance);
      }

      const allCampaigns = await contractInstance.getAllCampaigns();
      // console.log(allCampaigns[0])
      setCampaigns(allCampaigns);
    } catch (error) {
      console.error(error);
    }
  };

  const createCampaign = async () => {
    try {
      console.log(contract);
      const name = prompt("Enter the name of the campaign");
      const goal = prompt("Enter the goal of the campaign");
      const deadline = prompt("Enter the deadline of the campaign");
      const description = prompt("Enter the description of the campaign");
      const campaign = await contract.createCampaign(goal, deadline, name, description);
      //block need to move to the next block
      // await provider.send("evm_mine", []);
      // const campaign = await contract.createCampaign(100, 1719859200, "Campaign 1");
      console.log(campaign);
      setCampaigns([...campaigns, campaign]);
    } catch (error) {
      console.error(error);
    }
  };

  const fundCampaign = async (index: number) => {
    try {
      const amount = prompt("Enter the amount to fund");
      const campaign = await contract.fund(index, { value: amount });
      //refetch the campaigns
      const allCampaigns = await contract.getAllCampaigns();
      setCampaigns(allCampaigns);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCampaign = async (index: number) => {
    try {
      const campaign = await contract.deleteCampaign(index);
      //refetch the campaigns
      const allCampaigns = await contract.getAllCampaigns();
      setCampaigns(allCampaigns);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getContract();
  }, [isConnected]);

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between p-3 bg-gray-800 text-white">
        <h1 className="text-2xl font-bold">CrowdFunding</h1>
        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={createCampaign}
                  className="text-white px-4 py-2 rounded-md bg-blue-700"
                >
                  Create Campaign
                </button>
              </div>
              <button className="text-white px-4 py-2 rounded-md bg-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                  <p>{account.slice(0, 6) + "..." + account.slice(-4)}</p>
                </div>
              </button>
            </div>
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>
      <div className="flex flex-col flex-wrap p-4">
        {/* Grid of projects */}
        <p className="text-3xl font-bold text-center my-4">All Campaigns</p>
        <div className="grid grid-cols-3 gap-4 w-full max-w-7xl mx-auto">
          {campaigns.map((campaign: any, index: number) => (
            <div className="bg-white p-4 rounded-md w-full" key={index}>
              <button className="text-gray-500" onClick={() => router.push(`/campaign/${campaign.id}`)}>Campaign Details</button>
              <h2 className="text-lg font-bold text-black">{campaign.name}</h2>
              <p className="text-gray-500">{campaign.description}</p>
              <p className="text-gray-500">
                Funding Goal: {campaign.amount}/{campaign.goal}ETH
              </p>
              <p className="text-gray-500">
                Deadline: {campaign.deadline}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => fundCampaign(index)} className="bg-blue-600 text-white px-4 py-2 rounded-md w-full">
                  Fund
                </button>
                {campaign.creator?.toLowerCase() === account?.toLowerCase() && (
                  <button onClick={() => deleteCampaign(index)} className="bg-red-600 text-white px-4 py-2 rounded-md w-full">
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
