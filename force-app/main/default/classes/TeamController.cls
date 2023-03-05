public with sharing class TeamController {
    @AuraEnabled(cacheable=true)
    public static List<sObject> getTeams() {
        try {
            List<sObject> teams = [Select id, Name from Team__c];
            return teams;
        } catch (Exception e) {
            System.debug('Exception: '+e.getMessage());
            return null;
        }
    }
    @AuraEnabled
    public static TeamMember__c saveTeamMember (String memberJSON){
        try {
            System.debug('memberJSON');
            System.debug(memberJSON);
            TeamMemberWrapper member = (TeamMemberWrapper)JSON.deserialize(memberJSON,TeamMemberWrapper.class);
            TeamMember__c teamMember = new TeamMember__c();
            if (member != null){
                teamMember.Name = member.Name;
                teamMember.Skills__c = member.Skills;
                teamMember.Team__c = member.TeamId;
                insert teamMember;
            }
            return teamMember;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<TeamMemberWrapper> getTeamMemberById(string teamId) {
        try {
            List<TeamMemberWrapper> teamMemberWrapper = new List<TeamMemberWrapper>();
            List<TeamMember__c> teamsMember = new List<TeamMember__c>();
            if(!String.isBlank(teamId) && teamId!=null){
                teamsMember = [Select Id, Name,Skills__c,Team__r.Name,Team__c from TeamMember__c Where Team__c =: teamId];
            }
            else{
                teamsMember = [Select Id, Name,Skills__c,Team__r.Name,Team__c from TeamMember__c];
            }
            for (TeamMember__c member : teamsMember) {
                TeamMemberWrapper wrapper = new TeamMemberWrapper();
                wrapper.Id = member.Id;
                wrapper.Name = member.Name;
                wrapper.Skills = member.Skills__c;
                wrapper.TeamName = member.Team__r.Name;
                wrapper.TeamId = member.Team__c;
                teamMemberWrapper.add(wrapper);
            }
            return teamMemberWrapper;
        } catch (Exception e) {
            System.debug('Exception: '+e.getMessage());
            return null;
        }
    }
    public class TeamMemberWrapper{
        @AuraEnabled public string Id {get;set;}
        @AuraEnabled public String Name {get;set;}
        @AuraEnabled public String Skills {get;set;}
        @AuraEnabled public String TeamId {get;set;}
        @AuraEnabled public String TeamName {get;set;}
    }
}