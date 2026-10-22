trainFeature = [0.2; 0.6; 0.9];
queryFeature = 0.55;
distance = abs(trainFeature - queryFeature);
[~, nearest] = min(distance);
disp([distance; nearest]);
