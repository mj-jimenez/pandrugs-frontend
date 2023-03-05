## About PanDrugs
PanDrugs is a computational methodology implented as a webtool to guide the selection of personalised treatments for cancer patients. 

The first version of PanDrugs, which was published in 2018, prioritized anticancer drug treatments according to gene lists or somatic variants. 

PanDrugs 2.0 includes novelties such as:

- **A major update of PanDrugsdb:** With up-to-date drug-gene associations retrieved from several sources. <!-- link to sources -->

- **New inputs:** Copy number variants (CNVs), expression data and germline variants. 

- **New drug-gene association:** In addition to direct targets, biomarkers and pathway members, PanDrugs 2.0 also considers genetic dependencies for ranking the most suitable therapeutic options.

- **An Adverse Drug Reaction (ADR) aware drug prioritization:** Whenever germline variants are present in the input Variant Calling File (VCF), PanDrugs can label the ranked drugs with their Clinical Pharmacogenetics Implementation Consortium (CPIC) recommendations retrieved via PharmCAT.

- **A multi-omics prioritization mode:** The user can rank PanDrugsdb treatments based on up to 3 different inputs: somatic (and optionally, germline) variants, CNVs and expression data.

- **A patient report:** PanDrugs 2.0 generates intuitive reports to support clinical decision-making.

PanDrugs has been designed, created and is mantained by the CNIO Bioinformatics Unit and the SING Group:

### CNIO Bioinformatics Unit

The Bioinformatics Unit of the Spanish National Cancer Research Centre (BU-CNIO)...

<div style="text-align: left;"><a href="https://bioinformatics.cnio.es"><img src="bu-cnio-logo.png" alt="BU-CNIO" height="10%" width="10%"/></a>

### SING Group
The Next Generation Computer Systems Group (SING)...

<div style="text-align: left;"><a href="http://www.sing-group.org"><img src="sing-logo.png" alt="SING" height="16%" width="16%"/></a>
