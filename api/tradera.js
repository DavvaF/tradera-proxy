import soap from 'soap';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing auction ID" });
  }

  const wsdl = 'https://api.tradera.com/v3/publicservice.asmx?WSDL';

  try {
    const client = await soap.createClientAsync(wsdl);
    const [result] = await client.GetItemsInformationAsync({
      itemIds: { long: [parseInt(id)] }
    });

    const item = result.GetItemsInformationResult.Items.Item;

    return res.status(200).json({
      auctionId: id,
      title: item.Title,
      currentPrice: item.CurrentPrice,
      numberOfBids: item.NumberOfBids,
      endTime: item.EndTime
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch from Tradera" });
  }
}
