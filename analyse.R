library(plyr)
d <- read.csv("eeg.csv")
u <- d[!duplicated(d[,c('abnahmestelle')]),]
branche_bundesland <- ddply(u, .(bundesland, branche), summarise, 
                N    = length(abnahmestelle))
                
                
x <- read.csv(file("52111-0004.csv",encoding="ISO-8859-1"), sep=";")
x <- transform(x,  X1 = as.numeric(X1),X2 = as.numeric(X2),X3 = as.numeric(X3),X4 = as.numeric(X4))
x["gesamt"] <- rowSums(x[,5:8],na.rm = T)
untern <- x[,c(2,4,9)]
unternehmen_pro_bundesland <- rowsum(untern$gesamt,untern$Bundesland)
colnames(n)[1]="Bundesland"


niederlassungen <- niederlassungen[order(niederlassungen[,3] ,decreasing=T),]
