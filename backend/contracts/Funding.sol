// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Funding {
    struct Campaign {
        uint256 id;
        uint256 amount;
        uint256 goal;
        uint256 deadline;
        uint256 start;
        uint256 end;
        string name;
        string description;
        address creator;
        address[] funders;
    }
    Campaign[] public allCampaigns;

    function createCampaign(uint256 _goal, uint256 _deadline, string memory _name, string memory _description) public payable {
        Campaign memory campaign = Campaign({
            id: allCampaigns.length,
            amount: 0,
            goal: _goal,
            deadline: _deadline,
            start: block.timestamp,
            end: block.timestamp + _deadline,
            name: _name,
            description: _description,
            creator: msg.sender,
            funders: new address[](0)
        });
        allCampaigns.push(campaign);
    }

    function getAllCampaigns() public view returns (Campaign[] memory) {
        return allCampaigns;
    }
    
    function fund(uint256 id) public payable {
        Campaign storage campaign = allCampaigns[id];
        // require(block.timestamp >= campaign.start && block.timestamp <= campaign.end, "Campaign is not active");
        require(msg.value > 0, "Funding amount must be greater than 0");
        require(campaign.amount + msg.value <= campaign.goal, "Campaign goal exceeded");
        campaign.amount += msg.value;
        campaign.funders.push(msg.sender);
    }

    function deleteCampaign(uint256 id) public {
        Campaign storage campaign = allCampaigns[id];
        require(msg.sender == campaign.creator, "Only creator can delete campaign");
        allCampaigns[id] = allCampaigns[allCampaigns.length - 1];
        allCampaigns.pop();
    }
    
    function getCampaignDetails(uint256 id) public view returns (Campaign memory) {
        return allCampaigns[id];
    }

}