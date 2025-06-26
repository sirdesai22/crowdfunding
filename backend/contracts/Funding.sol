// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Funding {
    struct Campaign {
        uint256 amount;
        uint256 goal;
        uint256 deadline;
        uint256 start;
        uint256 end;
        string name;
        address creator;
    }
    Campaign[] public allCampaigns;

    function createCampaign(uint256 _goal, uint256 _deadline, string memory _name) public payable {
        Campaign memory campaign = Campaign({
            amount: 0,
            goal: _goal,
            deadline: _deadline,
            start: block.timestamp,
            end: block.timestamp + _deadline,
            name: _name,
            creator: msg.sender
        });
        allCampaigns.push(campaign);
    }

    function getAllCampaigns() public view returns (Campaign[] memory) {
        return allCampaigns;
    }
    
    function fund(uint256 _campaignIndex) public payable {
        Campaign storage campaign = allCampaigns[_campaignIndex];
        // require(block.timestamp >= campaign.start && block.timestamp <= campaign.end, "Campaign is not active");
        require(msg.value > 0, "Funding amount must be greater than 0");
        require(campaign.amount + msg.value <= campaign.goal, "Campaign goal exceeded");
        campaign.amount += msg.value;
    }
    
    function getCampaignDetails(uint256 _campaignIndex) public view returns (Campaign memory) {
        return allCampaigns[_campaignIndex];
    }

}