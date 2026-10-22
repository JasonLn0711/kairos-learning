neighborLabels = ["circle" "circle" "square"];
classNames = ["circle" "triangle" "square"];
votes = arrayfun(@(name) sum(neighborLabels == name), classNames);
[~, winner] = max(votes);
disp(classNames(winner));
