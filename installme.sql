CREATE DATABASE project-bailey;
USE project-bailey;
CREATE TABLE IF NOT EXISTS stickymessages(
    GuildID VARCHAR(255),
    ChannelID VARCHAR(255),
    StickyMessage TEXT
);
CREATE TABLE IF NOT EXISTS giveaways(
    GuildID VARCHAR(255),
    GiveawayID INT AUTO_INCREMENT,
    HostedBy VARCHAR(255),
    MessageID VARCHAR(255),
    ChannelID VARCHAR(255),
    Prize VARCHAR(255),
    Duration VARCHAR(255),
    GDescription VARCHAR(255),
    WinnerCount INT,
    Active VARCHAR(255),
    Entries INT,
    PRIMARY KEY (GiveawayID)
);
CREATE TABLE IF NOT EXISTS giveawayentries(
    GiveawayID INT,
    GuildID VARCHAR(255),
    ChannelID VARCHAR(255),
    MessageID VARCHAR(255),
    UserID VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS guildlogging(
    GuildID VARCHAR(255),
    ModLogs VARCHAR(255),
    MemberLogs VARCHAR(255),
    RoleLogs VARCHAR(255),
    ChannelLogs VARCHAR(255),
    MessageLogs VARCHAR(255),
    WelcomeLogs VARCHAR(255),
    LeaveLogs VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS modperms(
    GuildID VARCHAR(255),
    RoleID VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS guildmembers(
    GuildID VARCHAR(255),
    WelcomeMessage TEXT,
    LeaveMessage TEXT,
    MemberRole VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS reminders(
    GuildID VARCHAR(255),
    ReminderID INT AUTO_INCREMENT,
    UserID VARCHAR(255),
    Reminder VARCHAR(255),
    Timer VARCHAR(255),
    Active BOOLEAN,
    PRIMARY KEY (ReminderID)
);
CREATE TABLE IF NOT EXISTS jointocreate(
    GuildID VARCHAR(255),
    ChannelID VARCHAR(255),
    ChannelUserLimit VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS prunes(
    GuildID VARCHAR(255),
    CaseID INT AUTO_INCREMENT,
    PruneType VARCHAR(255),
    StaffID VARCHAR(255),
    ChannelID VARCHAR(255),
    MessageCount VARCHAR(255),
    Reason VARCHAR(255),
    PRIMARY KEY (CaseID)
);
CREATE TABLE IF NOT EXISTS automod(
    GuildID VARCHAR(255),
    AntiInvite VARCHAR(255),
    PingPrev VARCHAR(255),
    AltAccount VARCHAR(255),
    AltAccountDay INT
);
CREATE TABLE IF NOT EXISTS warns(
    GuildID VARCHAR(255),
    CaseID INT,
    StaffID VARCHAR(255),
    UserID VARCHAR(255),
    Reason VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS locks(
    GuildID VARCHAR(255),
    CaseID INT,
    LockType VARCHAR(255),
    StaffID VARCHAR(255),
    ChannelID VARCHAR(255),
    Reason VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS rates(
    GuildID VARCHAR(255),
    CaseID INT,
    RateType VARCHAR(255),
    StaffID VARCHAR(255),
    ChannelID VARCHAR(255),
    Reason VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS btnpanels(
    GuildID TEXT,
    PanelID INT,
    LogChannelID TEXT,
    CategoryID TEXT,
    Title TEXT,
    Description TEXT
);
CREATE TABLE IF NOT EXISTS btnroles(
    GuildID TEXT,
    PanelID INT,
    RoleID TEXT
);
CREATE TABLE IF NOT EXISTS drppanels(
    GuildID TEXT,
    PanelID INT,
    LogChannelID TEXT,
    CategoryID TEXT
);
CREATE TABLE IF NOT EXISTS drptickets(
    GuildID TEXT,
    PanelID INT,
    TicketID INT,
    Name TEXT,
    Description TEXT
);
CREATE TABLE IF NOT EXISTS drproles(
    GuildID TEXT,
    PanelID INT,
    RoleID TEXT
);
CREATE TABLE IF NOT EXISTS logs(
    GuildID TEXT,
    PanelID INT,
    PanelType TEXT,
    OpeningMemberID TEXT,
    ClosingMemberID TEXT,
    ClaimingMemberID TEXT,
    ChannelID TEXT,
    Locked TEXT,
    Closed TEXT,
    TicketID INT,
    Archived TEXT
);