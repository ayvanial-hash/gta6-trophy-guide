import json
import sys

# Define the walkthroughs
walkthroughs = {
    38: ["Find a Rhino tank at the military base or a spawn point.", "Accept the tank-related challenge via the interaction menu.", "Use the tank's cannon to destroy required targets or survive the heat.", "Avoid police units to keep your tank intact during the challenge.", "Complete all objectives within the tank challenge time limit.", "The trophy unlocks once the tank challenge is successfully cleared."],
    39: ["Locate the jewelry store and enter during nighttime for less security.", "Wait for patrols to pass before entering the main display area.", "Take items quietly; do not run or cause unnecessary noise.", "Exit through the back door to avoid front-facing witnesses.", "Reach your escape vehicle undetected by any police officers.", "The trophy unlocks as soon as you exit the restricted area safely."],
    40: ["Find bank vault icons on the map and start the robbery.", "Clear all enemies and crack the vault safely.", "Ensure you have a fast escape vehicle parked nearby before starting.", "Lose your wanted level immediately after leaving the bank.", "Repeat this across 5 different vault robbery locations to pop the trophy."],
    41: ["Patrol major roads until an armored truck spawns nearby.", "Stop the truck using a blockade or gunfire.", "Loot the cargo quickly before police reinforcement arrives.", "Escape the area and lose your wanted level to finalize the robbery.", "The trophy will pop once the escape is fully complete."],
    42: ["Focus on visiting unexplored regions of the map while doing other tasks.", "Check the world map for any areas that remain unlit/dark.", "Travel to edges, coastlines, and islands to fully reveal the map.", "Use the stats screen to monitor percentage completion of exploration.", "The trophy unlocks once every region has been visited."],
    43: ["Locate all gang illegal operation sites marked on your map.", "Approach each site and defeat the defenders.", "Rob the operation successfully to count it for the trophy.", "Repeat for every distinct gang's operation across the city.", "The trophy unlocks after successfully robbing one operation per gang."],
    44: ["Travel to Ocean Beach and find a restaurant with a view.", "Sit at the bar and order a cocktail from the menu.", "Allow the drinking animation to finish completely.", "The trophy will pop shortly after the drink is finished."],
    45: ["Find a vehicle showroom that has large glass display windows.", "Enter the building and choose a fast vehicle.", "Drive the vehicle directly through the glass display windows to the outside.", "Successfully exit the building in this manner to trigger the trophy."],
    46: ["Find the bowling alley owned by Kolt & Associates on your map.", "Start the bowling minigame at the alley.", "Complete a throw with a proper follow-through motion.", "The trophy is awarded once the minigame action is registered."],
    47: ["Prioritize completing activities featuring your partner.", "Follow the partnership-building story events as they appear.", "Continue playing with your partner until your relationship status reaches its peak.", "The trophy unlocks when the relationship peak moment is reached."],
    48: ["Pay close attention to all story choice points presented.", "Make decisions deliberately during mission branches.", "Observe the consequences of your choices in subsequent cutscenes.", "The trophy will pop as you progress through the narrative with your choices."],
    49: ["Identify the specific event designed to be failed.", "Attempt the event and let it fail on your first try.", "Immediately restart the mission and complete it on your second attempt.", "The trophy pops upon successful completion on the retry."],
    50: ["Progress through the story until the surreal late-game scene triggers.", "Stay engaged during the scene until the cutscene ends.", "The trophy is awarded immediately upon the completion of this bizarre moment."],
    51: ["Equip a melee weapon and find a suitable vehicle.", "Drive toward a group of pedestrians or objects.", "Perform the melee drive-by attack precisely as you pass the target.", "Ensure you knock over the target with the hit.", "The trophy unlocks if a successful 'strike' is registered."],
    52: ["Rob various illicit sources like vaults and armored trucks for marked bills.", "Visit your laundering contact and process the marked bills.", "Accumulate a total of $250,000 processed through these contacts.", "Keep laundering your loot whenever possible to maximize efficiency.", "The trophy unlocks once $250,000 total is laundered."],
    53: ["Make purchases at diverse shop types across the map.", "Buy items like weapons, clothes, and vehicle parts.", "Maintain a regular shopping habit during your free roam sessions.", "Check your spending total in the statistics screen.", "The trophy will pop once you reach $100,000 in total purchases."],
    54: ["Look for garage properties with a 'For Sale' sign on the map.", "Purchase every available garage property using your laundered funds.", "Keep an eye on property availability throughout your playthrough.", "The trophy unlocks once you own the full set of garage properties."],
    55: ["Open the Scooter Bros app on your mobile phone.", "Acquire different vehicle models by stealing or buying them.", "Register each new vehicle through the app's interface.", "Repeat until you have registered 10 unique vehicle models.", "The trophy pops upon the 10th successful registration."]
}

# Get batch range from args
start = int(sys.argv[1])
end = int(sys.argv[2])

with open('/root/work/mf/repo/app/data/trophies.json', 'r') as f:
    data = json.load(f)

for t in data['trophies']:
    if start <= t['id'] <= end:
        if t['id'] in walkthroughs:
            t['walkthrough'] = walkthroughs[t['id']]

with open('/root/work/mf/repo/app/data/trophies.json', 'w') as f:
    json.dump(data, f, indent=2)
